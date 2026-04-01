import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

export const uploadImage = async (base64String: string, path: string) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, path);
  await uploadString(storageRef, base64String, 'data_url');
  return await getDownloadURL(storageRef);
};
