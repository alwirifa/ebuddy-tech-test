import { db } from '../config/firebaseConfig';

export const addUser = async (userData: any) => {
  try {
    const response = await db.collection('users').add(userData);
    return response.id;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await db.collection('users').get();
    let users: any[] = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const docRef = db.collection('users').doc(userId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const docRef = db.collection('users').doc(userId);
    await docRef.update(userData);
    return `User with ID ${userId} updated successfully`;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
   
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      return null; // User tidak ditemukan
    }

    const user = snapshot.docs[0].data();
    if (user.password === password) {
      // Kembalikan data user beserta ID
      return { id: snapshot.docs[0].id, ...user };
    } else {
      return null; 
    }
  } catch (error) {
    console.error("Error in loginUser repository:", error);
    throw error; 
  }
};