import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { auth } from 'firebase-admin';

const propertiesCollection = collection(db, 'properties');

async function verifyToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    return null;
  }
  try {
    const decodedToken = await auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = query(propertiesCollection, where("userId", "==", uid));
  const snapshot = await getDocs(q);
  const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(properties);
}

export async function POST(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newProperty = { ...body, userId: uid, units: [] };
    const docRef = await addDoc(propertiesCollection, newProperty);
    return NextResponse.json({ id: docRef.id, ...newProperty }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const propertyRef = doc(db, 'properties', body.id);
    const propertySnap = await getDoc(propertyRef);

    if (!propertySnap.exists() || propertySnap.data().userId !== uid) {
      return NextResponse.json({ error: 'Unauthorized or property not found' }, { status: 403 });
    }

    await updateDoc(propertyRef, body);
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const propertyRef = doc(db, 'properties', id);
      const propertySnap = await getDoc(propertyRef);

      if (!propertySnap.exists() || propertySnap.data().userId !== uid) {
        return NextResponse.json({ error: 'Unauthorized or property not found' }, { status: 403 });
      }

      await deleteDoc(propertyRef);
      return NextResponse.json({ message: 'Property deleted' });
    }
    return NextResponse.json({ error: 'Property ID not provided' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 400 });
  }
}