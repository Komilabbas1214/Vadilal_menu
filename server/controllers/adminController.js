const Order = require('../models/Order');

// @desc    Get dashboard metrics & stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Filter today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const todaySales = todayOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingCount = await Order.countDocuments({ status: 'Pending' });
    const preparingCount = await Order.countDocuments({ status: 'Preparing' });
    const readyCount = await Order.countDocuments({ status: 'Ready' });
    const completedCount = await Order.countDocuments({ status: 'Completed' });

    res.json({
      success: true,
      data: {
        todaySales,
        todayOrdersCount: todayOrders.length,
        pendingCount,
        preparingCount,
        readyCount,
        completedCount,
      },
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate admin stats' });
  }
};

module.exports = { getAdminStats };
