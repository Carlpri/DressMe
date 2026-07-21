import { PrismaClient } from "@prisma/client";

export async function seedSiteSettings(prisma: PrismaClient) {
  console.log("🌐 Seeding site settings...");

  const existing = await prisma.siteSettings.findFirst();

  if (existing) {
    console.log("   Site settings already exist, skipping...");
    return existing;
  }

  const settings = await prisma.siteSettings.create({
    data: {
      siteName: "DressMe",
      tagline: "Your Style. Powered by AI. Inspired by You.",
      logoUrl: "",
      logoDarkUrl: "",
      faviconUrl: "",
      heroBannerUrl: "",
      supportEmail: "support@dressme.co.ke",
      supportPhone: "+254700000000",
      whatsapp: "+254700000000",
      facebook: "https://facebook.com/dressme",
      instagram: "https://instagram.com/dressme",
      tiktok: "https://tiktok.com/@dressme",
      x: "https://twitter.com/dressme",
      linkedin: "https://linkedin.com/company/dressme",
      youtube: "https://youtube.com/@dressme",
      physicalAddress: "Nairobi, Kenya",
      currency: "KES",
      defaultShippingFee: 500,
      aboutUs: "DressMe is Kenya's premier AI-powered fashion platform, connecting you with the best African fashion brands and styles tailored to your unique personality.",
      privacyPolicy: "Your privacy is important to us. We collect and use your data responsibly to provide you with the best fashion experience.",
      termsOfService: "By using DressMe, you agree to our terms of service which govern your use of our platform.",
      refundPolicy: "We offer refunds within 14 days of purchase for items in their original condition.",
      shippingPolicy: "We ship across Kenya. Standard delivery takes 3-5 business days.",
      maintenanceMode: false,
    },
  });

  console.log("   ✅ Site settings seeded successfully");
  return settings;
}
