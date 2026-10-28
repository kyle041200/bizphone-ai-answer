import strategy from "@/assets/kghq-team-work.jpg";
import marketing from "@/assets/marketing-team-studio-hq.jpg";
import assistant from "@/assets/articles-ai-assistant.jpg";
import growth from "@/assets/kghq-home-hero.jpg";
import appointments from "@/assets/articles-appointments.jpg";
import social from "@/assets/articles-social.jpg";
import outreach from "@/assets/sales-team-pipeline-hq-fix.jpg";
import outsourcing from "@/assets/business-support-team-hq.jpg";
import agency from "@/assets/sales-team-conversation.jpg";

export const articleCategories = ["Entrepreneurship", "Leadership", "Mindset", "Sales", "Technology"];
export type Article = { slug: string; title: string; categories: string[]; image: string; excerpt: string; sections: { title: string; body: string }[] };
export const articles: Article[] = [
  { slug: "strategic-planning-before-scaling", title: "Why Every Entrepreneur Needs Strategic Planning Before Scaling", categories: ["Entrepreneurship", "Leadership", "Mindset"], image: strategy, excerpt: "Build a stronger foundation before adding more people, channels, and complexity.", sections: [
    { title: "Know what you are scaling", body: "Growth amplifies the way your business already works. Before investing in more activity, clarify your offer, your ideal customer, and the problem you solve. A plan should connect those fundamentals to a specific business outcome." },
    { title: "Find the constraint", body: "Look at the customer journey from first contact to delivery. Is the biggest obstacle visibility, conversion, follow-up, or capacity? Choose the bottleneck that deserves attention before spreading resources across unrelated projects." },
    { title: "Turn priorities into execution", body: "Give each priority an owner, a practical next action, and a measure of progress. Review what happened regularly and change the plan when evidence changes. Strategic planning is a working discipline, not a document that sits in a folder." },
  ] },
  { slug: "digital-marketing-tactics-small-business", title: "5 Proven Digital Marketing Tactics to Boost Small Business Conversions", categories: ["Entrepreneurship", "Mindset", "Sales"], image: marketing, excerpt: "Five practical places to focus when attention isn’t turning into enquiries.", sections: [
    { title: "1. Make the next step obvious", body: "Give each important page a clear purpose and a prominent call to action. Explain what happens after someone enquires, and remove fields that are not needed to start the conversation." },
    { title: "2. Match the message to the visitor", body: "Keep the promise in your ad, email, or social post consistent with the page it leads to. Use language that reflects the customer’s problem rather than internal jargon." },
    { title: "3. Show relevant proof", body: "Use genuine customer stories and examples that demonstrate the work you do. Specific, verifiable evidence helps visitors understand whether your business is a good fit." },
    { title: "4. Follow up with useful content", body: "Offer a helpful resource and build a permission-based follow-up sequence. Answer common questions and make it easy for interested prospects to take the next step." },
    { title: "5. Measure and improve", body: "Track enquiries and completed actions, not just visits. Test one meaningful change at a time so you can understand what improves the experience and what does not." },
  ] },
  { slug: "future-of-virtual-assistant-services", title: "The Future of Virtual Assistant Services: AI, Automation, and Human Touch", categories: ["Entrepreneurship", "Technology"], image: assistant, excerpt: "Where smart systems help—and where human judgment still matters.", sections: [
    { title: "Automate repeatable steps", body: "Routine routing, reminders, and data movement can often be handled by well-configured systems. Start with a stable process before automating it, and define what should happen when information is missing." },
    { title: "Keep people accountable", body: "AI can accelerate research and drafting, but someone still needs to check accuracy, handle exceptions, and communicate with customers. Human oversight is especially important when work involves confidential information or consequential decisions." },
    { title: "Build a balanced workflow", body: "Pair clear instructions with appropriate access and a review step. The goal is not to replace every task with software; it is to free people to focus on the work that benefits from judgment and care." },
  ] },
  { slug: "evolution-of-growth-services", title: "The Evolution of Growth Services for Small Business Owners: What’s Next?", categories: ["Entrepreneurship", "Mindset"], image: growth, excerpt: "From isolated tasks to coordinated strategy, systems, and execution.", sections: [
    { title: "Beyond disconnected services", body: "A website, a campaign, and a prospect list are more useful when they support the same goal. Growth support should connect the work instead of treating every deliverable as an isolated project." },
    { title: "Capacity that follows priorities", body: "Small businesses rarely need the same capability all the time. Flexible support makes it possible to focus on content now, sales next, and systems when manual work becomes a bottleneck." },
    { title: "Progress over activity", body: "Define what a project should change for the business. Review completed work alongside outcomes, and use that evidence to decide the next priority rather than simply adding more tasks." },
  ] },
  { slug: "appointment-setting-guide", title: "Step-by-Step Guide to Appointment Setting for Small Business Owners", categories: ["Entrepreneurship"], image: appointments, excerpt: "A clear path from the right prospect to a useful first conversation.", sections: [
    { title: "Define a worthwhile meeting", body: "Agree on who should attend, what problem is relevant, and what makes a prospect a fit. A full calendar is not helpful if the meetings are unrelated to your offer." },
    { title: "Build the outreach and follow-up", body: "Research relevant prospects, write a concise message, and explain why a conversation may be useful. Use an appropriate follow-up cadence and respect opt-outs and applicable outreach rules." },
    { title: "Make booking easy", body: "Keep availability accurate, confirm the timezone, and include a short meeting agenda. Send reminders and make rescheduling straightforward." },
    { title: "Close the loop", body: "Record whether the meeting happened, what was learned, and the agreed next action. Use those notes to improve targeting and the handoff to the person handling the sales conversation." },
  ] },
  { slug: "social-media-virtual-assistants", title: "How Small Business Owners Can Leverage Social Media Virtual Assistants for Growth", categories: ["Entrepreneurship"], image: social, excerpt: "Keep content moving without making every post another founder task.", sections: [
    { title: "Separate direction from production", body: "Decide your audience, topics, and tone before delegating. A virtual assistant can help prepare, format, and schedule content while you retain ownership of the message." },
    { title: "Create a repeatable content workflow", body: "Build a shared calendar, organize source material, and agree on approvals. Repurpose useful ideas into different formats without losing their meaning or making unsupported claims." },
    { title: "Review what matters", body: "Look beyond posting frequency to useful conversations, enquiries, and audience feedback. Keep account access appropriate and define which messages should be escalated to your team." },
  ] },
  { slug: "outbound-outreach-book-more-clients", title: "How to Use Outbound Outreach Services to Consistently Book More Clients", categories: ["Entrepreneurship"], image: outreach, excerpt: "Connect better targeting, relevant messaging, and consistent follow-up.", sections: [
    { title: "Start with the right people", body: "Define the companies and buyer roles most likely to benefit from your offer. Check contact data and prioritize relevance over list size." },
    { title: "Coordinate the conversation", body: "Keep your call, email, and LinkedIn messaging aligned. Explain the business problem you help solve and use a clear, reasonable next step. Follow applicable outreach requirements and respect requests to stop contact." },
    { title: "Make the handoff work", body: "Agree on qualification criteria, record context, and assign follow-up ownership. Review replies, meeting quality, and next steps so you can improve the process. No outreach service can guarantee a particular number of clients." },
  ] },
  { slug: "outsourcing-helps-entrepreneurs", title: "From Data Entry to Growth Services: How Outsourcing Helps Entrepreneurs Win", categories: ["Entrepreneurship", "Mindset"], image: outsourcing, excerpt: "Delegate the work that slows you down while keeping ownership of the outcome.", sections: [
    { title: "Choose the right work to delegate", body: "Start with recurring tasks that have clear inputs and an observable result. Data cleanup, publishing, and research are often easier to hand off than an undefined request to fix everything." },
    { title: "Make expectations explicit", body: "Provide examples, source material, access boundaries, and a definition of done. Agree on how questions and exceptions will be handled before the work starts." },
    { title: "Build capacity deliberately", body: "Check the output, share feedback, and expand the scope when the workflow is reliable. Outsourcing works best when it reduces the founder’s coordination burden rather than creating another pile of work to manage." },
  ] },
  { slug: "reasons-entrepreneurs-need-marketing-agency", title: "5 Reasons Entrepreneurs Need a Marketing Agency for Small Business Success", categories: ["Entrepreneurship"], image: agency, excerpt: "When outside expertise and execution capacity can make a meaningful difference.", sections: [
    { title: "1. A clearer direction", body: "An outside perspective can help connect your audience, offer, and priorities. Start with a defined business goal rather than a list of channels to be active on." },
    { title: "2. Access to specialist skills", body: "Design, copywriting, SEO, and campaign execution require different capabilities. A coordinated team can provide the right skill for the work at hand." },
    { title: "3. More consistent execution", body: "Content and campaigns need ownership and follow-through. Agree on responsibilities and approvals so work keeps moving when the founder is busy." },
    { title: "4. Better measurement", body: "A useful reporting process connects activity to enquiries, sales conversations, and other relevant outcomes. It should explain what to adjust, not just present numbers." },
    { title: "5. More room to run the business", body: "External support can free time for customers, delivery, and leadership. The right partner adds capacity without removing your visibility into the work or promising guaranteed results." },
  ] },
];

export function filterArticles(category: string, query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter(article => (category === "All" || article.categories.includes(category)) && terms.every(term => `${article.title} ${article.excerpt} ${article.categories.join(" ")}`.toLowerCase().includes(term)));
}