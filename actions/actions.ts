'use server';

import { auth } from '@clerk/nextjs/server';
import { adminDb } from '../firebase-admin';
import { redirect } from 'next/navigation';
import liveblocks from '@/lib/liveblocks';

export async function createNewDocument() {
  auth();
  auth.protect();

  const { sessionClaims } = await auth();

  const docCollectionRef = adminDb.collection('documents');
  const docRef = await docCollectionRef.add({
    title: 'New Doc',
  });

  await adminDb
    .collection('users')
    .doc(sessionClaims?.email!)
    .collection('rooms')
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: 'owner',
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  console.log('deleteDocument', roomId);

  try {
    await adminDb.collection('documents').doc(roomId).delete();
    const query = await adminDb
      .collectionGroup('rooms')
      .where('roomId', '==', roomId)
      .get();

    const batch = adminDb.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  console.log('inviteUserToDocument', roomId, email);
  try {
    await adminDb
      .collection('users')
      .doc(email)
      .collection('rooms')
      .doc(roomId)
      .set({
        userId: email,
        role: 'editor',
        createdAt: new Date(),
        roomId,
      });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }
  try {
    await adminDb
      .collection('users')
      .doc(email)
      .collection('rooms')
      .doc(roomId)
      .delete();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
