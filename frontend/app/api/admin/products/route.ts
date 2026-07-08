import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { getProducts, saveProduct, updateProduct, deleteProduct } from '@/lib/db';
import { Product } from '@/data/products';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, description, category, gender, image } = body;

    if (!name || !price || !gender || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const products = await getProducts();
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct: Product = {
      id: maxId + 1,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name,
      price: parseFloat(price),
      description: description || '',
      category: category || 'General',
      gender,
      mainImage: image,
      image,
      images: [image],
      colors: body.colors || [],
      sizes: body.sizes || ['S', 'M', 'L', 'XL'],
      rating: 5.0,
      reviewCount: 0,
    };

    await saveProduct(newProduct);
    return NextResponse.json({ product: newProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, price, gender, image } = body;

    if (!id || !name || !price || !gender || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const products = await getProducts();
    const existing = products.find((p) => p.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated: Product = {
      ...existing,
      ...body,
      price: parseFloat(price),
    };

    await updateProduct(updated);
    return NextResponse.json({ product: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const id = parseInt(idStr);
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
