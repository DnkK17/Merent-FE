import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';

const useCameraImage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const imageUrls = querySnapshot.docs.map(doc => doc.data().imageUrl);
      setImages(imageUrls);
    };

    fetchImages();
  }, []);

  return images;
};

export default useCameraImage;
