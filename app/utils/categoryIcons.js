export const colorOptions = [
  "#ff9e70", // Orange (Default)
  "#FFD578", // Yellow
  "#ff8fa3", // Pink
  "#c780e8", // Purple
  "#95a4fc", // Blue
  "#4ade80", // Green
  "#f472b6", // Rose
  "#fbbf24", // Amber
];

export const iconCategories = {
  money: ["💰", "💸", "💳", "🧾", "🏦", "🪙", "💎", "🧧"],
  food: ["🍔", "🍕", "🍜", "🍣", "🍱", "🍰", "☕", "🍻", "🍎", "🥦"],
  transport: ["🚗", "🚕", "🚌", "✈️", "🚀", "🚲", "⛽", "🚧"],
  shopping: ["🛍️", "🛒", "🎁", "🕶️", "👗", "👟", "📱", "💻"],
  entertainment: ["🎉", "🎤", "🎮", "🎬", "🎧", "🎨", "🎪", "🎫"],
  medical: ["💊", "💉", "🩺", "🏥", "🩹", "🦷", "🧬", "🩸"],
  home: ["🏠", "🛋️", "🛏️", "🛁", "🧹", "🪴", "💡", "🔧"],
  other: ["📦", "📝", "📎", "📌", "🔒", "🔑", "🔔", "⚠️"],
};

export const iconCategoryList = [
  { key: "money", label: "Money" },
  { key: "food", label: "Food" },
  { key: "transport", label: "Transport" },
  { key: "shopping", label: "Shopping" },
  { key: "entertainment", label: "Fun" },
  { key: "medical", label: "Health" },
  { key: "home", label: "Home" },
  { key: "other", label: "Other" },
];

export const findCategoryByIcon = (icon) => {
  for (const [category, icons] of Object.entries(iconCategories)) {
    if (icons.includes(icon)) return category;
  }
  return "other";
};
