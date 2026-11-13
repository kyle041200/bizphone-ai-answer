export const notinaOffering = {
  monthlyPrice: 10,
  setupFee: 50,
  get signupTotal() { return this.monthlyPrice + this.setupFee; },
  inclusions: [
    "AI meeting notes and summaries", "Meeting transcripts", "Action item identification",
    "Searchable meeting history", "Conversational meeting search", "Organized Notina dashboard",
    "Access through KGHQ BuildSite",
  ],
};