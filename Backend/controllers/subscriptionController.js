const Subscription = require("../models/Subscription");
const Meal = require("../models/Meal");

const createSubscription = async (req, res) => {
  try {
    const { meal, duration, startDate } = req.body;
    const subscription = await Subscription.create({
      user: req.user.id,
      meal,
      duration,
      startDate,
    });
    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "customer") {
      query = { user: req.user.id };
    } else if (req.user.role === "provider") {
      const providerMeals = await Meal.find({ provider: req.user.id });
      const mealIds = providerMeals.map((m) => m._id);
      query = { meal: { $in: mealIds } };
    }

    const subscriptions = await Subscription.find(query)
      .populate("user", "name email address phone")
      .populate({
        path: "meal",
        populate: { path: "provider", select: "name email" }
      });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Subscription updated",
      updatedSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    await Subscription.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSkipDate = async (req, res) => {
  try {
    const { date } = req.body; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const dateIdx = subscription.skippedDates.indexOf(date);
    if (dateIdx > -1) {
      subscription.skippedDates.splice(dateIdx, 1);
    } else {
      subscription.skippedDates.push(date);
    }

    await subscription.save();
    res.status(200).json({
      message: "Skip date toggled successfully",
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getKitchenDashboard = async (req, res) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().split("T")[0];

    const providerMeals = await Meal.find({ provider: req.user.id });
    const mealIds = providerMeals.map((m) => m._id);

    const activeSubscriptions = await Subscription.find({
      meal: { $in: mealIds },
      status: "Active",
    })
      .populate("user", "name email address phone")
      .populate("meal", "title category price");

    const activeDeliveries = activeSubscriptions.filter((sub) => {
      if (sub.skippedDates.includes(targetDate)) {
        return false;
      }
      const start = new Date(sub.startDate);
      start.setHours(0, 0, 0, 0);
      const target = new Date(targetDate);
      target.setHours(0, 0, 0, 0);
      return target >= start;
    });

    const mealCounts = { Breakfast: 0, Lunch: 0, Dinner: 0, Total: 0 };
    activeDeliveries.forEach((sub) => {
      const cat = sub.meal.category;
      if (mealCounts[cat] !== undefined) {
        mealCounts[cat]++;
      }
      mealCounts.Total++;
    });

    res.status(200).json({
      date: targetDate,
      mealCounts,
      deliveries: activeDeliveries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  toggleSkipDate,
  getKitchenDashboard,
};