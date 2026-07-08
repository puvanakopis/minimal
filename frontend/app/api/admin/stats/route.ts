import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/adminAuth';
import { getOrders, getProducts, getUsers } from '@/lib/db';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [orders, products, users] = await Promise.all([
      getOrders(),
      getProducts(),
      getUsers(),
    ]);

    // Calculate metrics
    const totalSales = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;

    // Recent orders (sort by date descending)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Sales chart data - group by month/day. Let's make a simple mock/calculated chart of monthly sales
    // We can group sales of the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesByMonth = Array(12).fill(0).map((_, i) => ({
      name: months[i],
      sales: 0,
      orders: 0,
    }));

    orders.forEach((o) => {
      if (o.status !== 'Cancelled') {
        const date = new Date(o.createdAt);
        const monthIndex = date.getMonth();
        salesByMonth[monthIndex].sales += o.totalAmount;
        salesByMonth[monthIndex].orders += 1;
      }
    });

    // Slice to show last 6 months for chart readability
    const currentMonth = new Date().getMonth();
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonth - i + 12) % 12;
      chartData.push(salesByMonth[idx]);
    }

    return NextResponse.json({
      metrics: {
        totalSales,
        totalOrders,
        totalProducts,
        totalUsers,
      },
      recentOrders,
      chartData,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
