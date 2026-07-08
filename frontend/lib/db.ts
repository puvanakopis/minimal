import { connectToDatabase } from '@/lib/mongodb';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  category?: string;
  gender: 'men' | 'women' | 'unisex';
  mainImage?: string;
  image: string;
  images?: string[];
  colors?: Color[];
  sizes?: (Size | string)[];
  details?: string[];
  features?: string[];
  material?: string;
  careInstructions?: string[];
  rating?: number;
  reviewCount?: number;
}


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  role?: 'admin' | 'user';
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface PasswordReset {
  email: string;
  token: string;
  expiresAt: string;
}

export interface OrderProduct {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: string;
  type: 'signup' | 'forgot-password';
}


// ---------------- USER OPERATIONS ----------------

export async function getUsers(): Promise<User[]> {
  const { db } = await connectToDatabase();
  const list = await db.collection('users').find({}).toArray();
  return list as any;
}

export async function saveUser(user: User): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('users').insertOne(user);
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email: email.toLowerCase().trim() });
  return user ? (user as any) : undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ id });
  return user ? (user as any) : undefined;
}

export async function updateUserRole(id: string, role: 'admin' | 'user'): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('users').updateOne({ id }, { $set: { role } });
}

export async function deleteUser(id: string): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('users').deleteOne({ id });
}

// ---------------- SESSION OPERATIONS ----------------

export async function getSessions(): Promise<Session[]> {
  const { db } = await connectToDatabase();
  const list = await db.collection('sessions').find({}).toArray();
  return list as any;
}

export async function saveSession(session: Session): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('sessions').insertOne(session);
}

export async function findSessionById(id: string): Promise<Session | undefined> {
  const { db } = await connectToDatabase();
  const session = await db.collection('sessions').findOne({ id });
  return session ? (session as any) : undefined;
}

export async function deleteSession(id: string): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('sessions').deleteOne({ id });
}

// ---------------- OTP OPERATIONS ----------------

export async function saveOtp(record: OtpRecord): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('otps').deleteMany({ email: record.email.toLowerCase().trim(), type: record.type });
  await db.collection('otps').insertOne({
    ...record,
    email: record.email.toLowerCase().trim()
  });
}

export async function verifyOtp(email: string, otp: string, type: 'signup' | 'forgot-password'): Promise<boolean> {
  const { db } = await connectToDatabase();
  const normalizedEmail = email.toLowerCase().trim();
  const record = await db.collection('otps').findOne({ email: normalizedEmail, otp, type });

  if (!record) return false;

  if (new Date(record.expiresAt) < new Date()) {
    await db.collection('otps').deleteOne({ _id: record._id });
    return false;
  }

  await db.collection('otps').deleteOne({ _id: record._id });
  return true;
}

// ---------------- PRODUCT OPERATIONS ----------------

export async function getProducts(): Promise<Product[]> {
  const { db } = await connectToDatabase();
  const list = await db.collection('products').find({}).toArray();
  return list as any;
}

export async function saveProduct(product: Product): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('products').insertOne(product);
}

export async function updateProduct(product: Product): Promise<void> {
  const { db } = await connectToDatabase();
  const { _id, ...rest } = product as any;
  await db.collection('products').updateOne({ id: product.id }, { $set: rest });
}

export async function deleteProduct(id: number): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('products').deleteOne({ id });
}

// ---------------- ORDER OPERATIONS ----------------

export async function getOrders(): Promise<Order[]> {
  const { db } = await connectToDatabase();
  const list = await db.collection('orders').find({}).toArray();
  return list as any;
}

export async function saveOrder(order: Order): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('orders').insertOne(order);
}

export async function updateOrder(id: string, status: Order['status']): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('orders').updateOne({ id }, { $set: { status } });
}
