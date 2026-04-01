import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { successCases as initialCases, lawyers as initialLawyers } from '../data';

const DEFAULT_POPUP = {
  id: 1,
  title: "긴급 법률 상담 안내",
  content: "주말 및 공휴일에도 긴급 법률 상담이 가능합니다.\n\n상담 전화: 02-123-4567",
  imageUrl: "",
  link: "/consultation",
  isActive: true,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
};

const DEFAULT_REVIEWS = [
  {
    id: 1,
    result: "집행유예",
    text: "정말 막막한 상황이었는데, 변호사님 덕분에 선처를 받을 수 있었습니다. 밤낮없이 제 사건에 매달려주신 점 평생 잊지 않겠습니다.",
    bg: "/client_review_1.png"
  },
  {
    id: 2,
    result: "무혐의",
    text: "억울한 누명을 쓰고 너무 괴로웠습니다. 변호사님이 증거를 하나하나 찾아주셔서 무죄를 입증할 수 있었습니다. 감사합니다.",
    bg: "/client_review_2.png"
  },
  {
    id: 3,
    result: "승소",
    text: "복잡한 재산 분할 문제로 골치가 아팠는데, 명쾌하게 해결해주셨습니다. 전문적인 지식과 따뜻한 위로에 큰 감동을 받았습니다.",
    bg: "/client_review_3.png"
  }
];

export const useFirestore = (collectionName: string, initialData: any[] = []) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, collectionName);
    
    // Check if empty and seed initial data
    const seedData = async () => {
      try {
        const snapshot = await getDocs(colRef);
        if (snapshot.empty && initialData.length > 0) {
          for (const item of initialData) {
            await setDoc(doc(colRef, String(item.id)), item);
          }
        }
      } catch (error) {
        console.error("Error seeding data:", error);
      }
    };

    seedData();

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id }); // Ensure id is string or number based on original
      });
      
      // Sort by order, then by createdAt, then by id
      items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return Number(a.order) - Number(b.order);
        }
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return Number(a.id) - Number(b.id);
      });
      
      setData(items.length > 0 ? items : initialData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setData(initialData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addOrUpdate = async (item: any) => {
    try {
      // Ensure id exists
      const id = item.id ? String(item.id) : String(Date.now());
      await setDoc(doc(db, collectionName, id), { ...item, id: isNaN(Number(id)) ? id : Number(id) });
    } catch (error) {
      console.error("Error saving document:", error);
      throw error;
    }
  };

  const remove = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, collectionName, String(id)));
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  return { data, loading, addOrUpdate, remove };
};

export { initialCases, initialLawyers, DEFAULT_POPUP, DEFAULT_REVIEWS };
