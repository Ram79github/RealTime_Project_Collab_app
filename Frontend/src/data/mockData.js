export const people = [
  { name: "Olivia Rhye", initials: "OR", color: "lilac" },
  { name: "Phoenix Baker", initials: "PB", color: "peach" },
  { name: "Lana Steiner", initials: "LS", color: "mint" },
  { name: "Demi Wilkinson", initials: "DW", color: "blue" },
  { name: "Candice Wu", initials: "CW", color: "yellow" },
];

export const initialProjects = [
  { id: "website", name: "Website redesign", description: "A fresh look for the product experience.", color: "violet", icon: "✳", due: "Jun 28", progress: 68, members: [0, 1, 2, 3], tasks: 18 },
  { id: "mobile", name: "Mobile app", description: "Your next favorite app, in the making.", color: "coral", icon: "◈", due: "Jul 12", progress: 42, members: [1, 2, 4], tasks: 24 },
  { id: "brand", name: "Brand refresh", description: "Making our brand feel more like us.", color: "green", icon: "✦", due: "Aug 04", progress: 85, members: [0, 3, 4], tasks: 12 },
];

export const initialTasks = [
  { id: 1, title: "Design homepage hero section", status: "In progress", tag: "Design", priority: "High", due: "Jun 18", assignees: [0, 1], comments: 4, checklist: "3/5", description: "Explore a more confident direction for the homepage. Keep the product story clear and make the primary action easy to find." },
  { id: 2, title: "Create responsive navigation", status: "In progress", tag: "Development", priority: "Medium", due: "Jun 20", assignees: [1, 3], comments: 2, checklist: "2/4", description: "Build a responsive navigation that works across desktop and mobile layouts." },
  { id: 3, title: "Review competitor websites", status: "In progress", tag: "Research", priority: "Low", due: "Jun 19", assignees: [2], comments: 3, checklist: "", description: "Collect references and useful patterns from the current landscape." },
  { id: 4, title: "Finalize color palette", status: "In review", tag: "Design", priority: "Medium", due: "Jun 17", assignees: [0, 4], comments: 6, checklist: "4/4", description: "Document the core palette, contrast pairings, and semantic colors." },
  { id: 5, title: "Set up component library", status: "In review", tag: "Development", priority: "High", due: "Jun 21", assignees: [1, 3], comments: 1, checklist: "5/8", description: "Create reusable foundations for the product UI." },
  { id: 6, title: "Write product intro copy", status: "To do", tag: "Content", priority: "Low", due: "Jun 24", assignees: [2, 4], comments: 0, checklist: "", description: "Draft concise copy that explains what makes the product different." },
  { id: 7, title: "Map onboarding journey", status: "To do", tag: "Research", priority: "Medium", due: "Jun 25", assignees: [0, 2], comments: 2, checklist: "1/6", description: "Map the first-run experience from signup to the first successful moment." },
  { id: 8, title: "Build testimonial carousel", status: "Done", tag: "Development", priority: "Low", due: "Jun 14", assignees: [3], comments: 2, checklist: "3/3", description: "Add a testimonial section that feels editorial and easy to browse." },
  { id: 9, title: "Audit accessibility states", status: "Done", tag: "Design", priority: "High", due: "Jun 13", assignees: [0, 4], comments: 5, checklist: "6/6", description: "Check keyboard navigation, focus states, and color contrast." },
];

export const columns = ["To do", "In progress", "In review", "Done"];
export const initialActivity = [
  { person: 1, text: "moved", target: "Create responsive navigation", time: "12 min ago", color: "peach" },
  { person: 2, text: "commented on", target: "Review competitor websites", time: "38 min ago", color: "mint" },
  { person: 0, text: "completed", target: "Finalize color palette", time: "1 hr ago", color: "lilac" },
];
