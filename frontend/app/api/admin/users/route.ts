import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { getUsers, updateUserRole, deleteUser } from '@/lib/db';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await getUsers();
    // Exclude password hashes & salts for security
    const sanitized = users.map(({ passwordHash, salt, ...rest }) => rest);
    return NextResponse.json({ users: sanitized });
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
    const { id, role } = await request.json();
    if (!id || !role) {
      return NextResponse.json({ error: 'Missing id or role' }, { status: 400 });
    }

    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Safety: prevent self-demotion
    if (admin.id === id) {
      return NextResponse.json({ error: 'Cannot demote yourself' }, { status: 400 });
    }

    await updateUserRole(id, role);
    return NextResponse.json({ success: true });
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    // Safety: prevent self-deletion
    if (admin.id === id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
