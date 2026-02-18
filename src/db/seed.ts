import { db } from "./index";
import { users, categories, listings, metrics } from "./schema";
import { faker } from "@faker-js/faker";

// ── European cities by country code ─────────────────────────────────────────
const EUROPEAN_CITIES: Record<string, string[]> = {
  FR: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Lille", "Nantes"],
  ES: ["Madrid", "Barcelona", "Valencia", "Seville", "Málaga", "Bilbao", "Palma de Mallorca"],
  PT: ["Lisbon", "Porto", "Faro", "Braga", "Funchal"],
  IT: ["Rome", "Milan", "Florence", "Naples", "Turin", "Venice", "Bologna"],
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne", "Düsseldorf", "Stuttgart"],
  GB: ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol", "Leeds", "Liverpool"],
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
  BE: ["Brussels", "Antwerp", "Ghent", "Bruges", "Liège"],
  CH: ["Zurich", "Geneva", "Bern", "Basel", "Lausanne"],
  AT: ["Vienna", "Salzburg", "Graz", "Innsbruck", "Linz"],
  IE: ["Dublin", "Cork", "Galway", "Limerick"],
  LU: ["Luxembourg City", "Esch-sur-Alzette"],
  GR: ["Athens", "Thessaloniki", "Heraklion", "Patras"],
  SE: ["Stockholm", "Gothenburg", "Malmö"],
  DK: ["Copenhagen", "Aarhus", "Odense"],
  FI: ["Helsinki", "Tampere", "Turku"],
  PL: ["Warsaw", "Kraków", "Wrocław", "Gdańsk", "Poznań"],
  CZ: ["Prague", "Brno", "Ostrava"],
  NO: ["Oslo", "Bergen", "Trondheim"],
};

const COUNTRY_CURRENCIES: Record<string, string> = {
  FR: "EUR", ES: "EUR", PT: "EUR", IT: "EUR", DE: "EUR",
  GB: "GBP", NL: "EUR", BE: "EUR", CH: "CHF", AT: "EUR",
  IE: "EUR", LU: "EUR", GR: "EUR", SE: "EUR", DK: "EUR",
  FI: "EUR", PL: "EUR", CZ: "EUR", NO: "EUR",
};

// ── Full hierarchical categories from categories.md ─────────────────────────
interface CategorySeed {
  slug: string;
  nameEn: string;
  nameRu: string;
  nameFr: string;
  nameEs: string;
  namePt: string;
  nameDe: string;
  nameIt: string;
  nameNl: string;
  icon: string;
  order: number;
  children?: CategorySeed[];
}

const CATEGORIES: CategorySeed[] = [
  // ── LEVEL 0: Sections ──────────────────────────────────────────────────────
  {
    slug: "online-business",
    nameEn: "Online Business",
    nameRu: "Онлайн-бизнес",
    nameFr: "Entreprise en ligne",
    nameEs: "Negocio online",
    namePt: "Negócio online",
    nameDe: "Online-Geschäft",
    nameIt: "Business online",
    nameNl: "Online bedrijf",
    icon: "cloud",
    order: 1,
    children: [
      {
        slug: "ecommerce",
        nameEn: "E-commerce",
        nameRu: "Интернет-магазины",
        nameFr: "E-commerce",
        nameEs: "Comercio electrónico",
        namePt: "E-commerce",
        nameDe: "E-Commerce",
        nameIt: "E-commerce",
        nameNl: "E-commerce",
        icon: "shopping-cart",
        order: 1,
        children: [
          { slug: "mono-brand-store", nameEn: "Single Brand Store", nameRu: "Монобрендовый магазин", nameFr: "Boutique mono-marque", nameEs: "Tienda monomarca", namePt: "Loja monomarca", nameDe: "Mono-Brand-Shop", nameIt: "Negozio monomarca", nameNl: "Monomerk winkel", icon: "shopping-cart", order: 1 },
          { slug: "multi-category-store", nameEn: "Multi-category Store", nameRu: "Мультикатегорийный магазин", nameFr: "Boutique multi-catégories", nameEs: "Tienda multicategoría", namePt: "Loja multicategoria", nameDe: "Multikategorie-Shop", nameIt: "Negozio multicategoria", nameNl: "Multicategorie winkel", icon: "shopping-cart", order: 2 },
          { slug: "niche-store", nameEn: "Niche Store", nameRu: "Нишевый магазин", nameFr: "Boutique de niche", nameEs: "Tienda de nicho", namePt: "Loja de nicho", nameDe: "Nischen-Shop", nameIt: "Negozio di nicchia", nameNl: "Niche winkel", icon: "shopping-cart", order: 3 },
          { slug: "dropshipping-store", nameEn: "Dropshipping Store", nameRu: "Дропшиппинг-магазин", nameFr: "Boutique dropshipping", nameEs: "Tienda de dropshipping", namePt: "Loja de dropshipping", nameDe: "Dropshipping-Shop", nameIt: "Negozio dropshipping", nameNl: "Dropshipping winkel", icon: "shopping-cart", order: 4 },
          { slug: "print-on-demand", nameEn: "Print-on-Demand Store", nameRu: "Print-on-demand магазин", nameFr: "Boutique impression à la demande", nameEs: "Tienda de impresión bajo demanda", namePt: "Loja de impressão sob demanda", nameDe: "Print-on-Demand-Shop", nameIt: "Negozio stampa su richiesta", nameNl: "Print-on-demand winkel", icon: "shopping-cart", order: 5 },
          { slug: "marketplace-seller", nameEn: "Marketplace Seller", nameRu: "Магазин на маркетплейсе", nameFr: "Vendeur sur marketplace", nameEs: "Vendedor en marketplace", namePt: "Vendedor em marketplace", nameDe: "Marktplatz-Verkäufer", nameIt: "Venditore su marketplace", nameNl: "Marktplaats verkoper", icon: "shopping-cart", order: 6 },
          { slug: "digital-goods-store", nameEn: "Digital Goods Store", nameRu: "Магазин цифровых товаров", nameFr: "Boutique de produits numériques", nameEs: "Tienda de productos digitales", namePt: "Loja de produtos digitais", nameDe: "Digitale Produkte Shop", nameIt: "Negozio prodotti digitali", nameNl: "Digitale producten winkel", icon: "shopping-cart", order: 7 },
          { slug: "subscription-box", nameEn: "Subscription Box", nameRu: "Магазин подписок", nameFr: "Box par abonnement", nameEs: "Caja de suscripción", namePt: "Caixa de assinatura", nameDe: "Abo-Box", nameIt: "Subscription box", nameNl: "Abonnementsbox", icon: "shopping-cart", order: 8 },
          { slug: "b2b-wholesale-store", nameEn: "B2B Wholesale Store", nameRu: "Оптовый B2B-магазин", nameFr: "Boutique B2B en gros", nameEs: "Tienda mayorista B2B", namePt: "Loja atacadista B2B", nameDe: "B2B Großhandel", nameIt: "Negozio B2B all'ingrosso", nameNl: "B2B groothandel winkel", icon: "shopping-cart", order: 9 },
        ],
      },
      {
        slug: "saas", nameEn: "SaaS", nameRu: "SaaS", nameFr: "SaaS", nameEs: "SaaS", namePt: "SaaS", nameDe: "SaaS", nameIt: "SaaS", nameNl: "SaaS",
        icon: "cloud", order: 2,
        children: [
          { slug: "b2b-saas", nameEn: "B2B SaaS", nameRu: "B2B SaaS", nameFr: "SaaS B2B", nameEs: "SaaS B2B", namePt: "SaaS B2B", nameDe: "B2B SaaS", nameIt: "SaaS B2B", nameNl: "B2B SaaS", icon: "cloud", order: 1 },
          { slug: "b2c-saas", nameEn: "B2C SaaS", nameRu: "B2C SaaS", nameFr: "SaaS B2C", nameEs: "SaaS B2C", namePt: "SaaS B2C", nameDe: "B2C SaaS", nameIt: "SaaS B2C", nameNl: "B2C SaaS", icon: "cloud", order: 2 },
          { slug: "micro-saas", nameEn: "Micro-SaaS", nameRu: "Micro-SaaS", nameFr: "Micro-SaaS", nameEs: "Micro-SaaS", namePt: "Micro-SaaS", nameDe: "Micro-SaaS", nameIt: "Micro-SaaS", nameNl: "Micro-SaaS", icon: "cloud", order: 3 },
          { slug: "nocode-lowcode", nameEn: "No-code / Low-code Platform", nameRu: "No-code/Low-code платформа", nameFr: "Plateforme no-code / low-code", nameEs: "Plataforma no-code / low-code", namePt: "Plataforma no-code / low-code", nameDe: "No-Code/Low-Code-Plattform", nameIt: "Piattaforma no-code / low-code", nameNl: "No-code / low-code platform", icon: "cloud", order: 4 },
          { slug: "api-services", nameEn: "API Services / Dev Tools", nameRu: "API-сервисы / Dev tools", nameFr: "Services API / Outils dev", nameEs: "Servicios API / Herramientas dev", namePt: "Serviços API / Ferramentas dev", nameDe: "API-Dienste / Dev-Tools", nameIt: "Servizi API / Dev tools", nameNl: "API-diensten / Dev tools", icon: "cloud", order: 5 },
          { slug: "ai-products", nameEn: "AI-powered Products", nameRu: "AI-продукты", nameFr: "Produits IA", nameEs: "Productos con IA", namePt: "Produtos com IA", nameDe: "KI-Produkte", nameIt: "Prodotti IA", nameNl: "AI-producten", icon: "cloud", order: 6 },
          { slug: "plugins-extensions", nameEn: "Plugins & Extensions", nameRu: "Плагины и расширения", nameFr: "Plugins et extensions", nameEs: "Plugins y extensiones", namePt: "Plugins e extensões", nameDe: "Plugins & Erweiterungen", nameIt: "Plugin ed estensioni", nameNl: "Plugins & extensies", icon: "cloud", order: 7 },
          { slug: "white-label-saas", nameEn: "White-label SaaS", nameRu: "White-label SaaS", nameFr: "SaaS en marque blanche", nameEs: "SaaS marca blanca", namePt: "SaaS marca branca", nameDe: "White-Label SaaS", nameIt: "SaaS white-label", nameNl: "White-label SaaS", icon: "cloud", order: 8 },
        ],
      },
      {
        slug: "content-media", nameEn: "Content & Media", nameRu: "Контент и медиа", nameFr: "Contenu et médias", nameEs: "Contenido y medios", namePt: "Conteúdo e mídia", nameDe: "Content & Medien", nameIt: "Contenuti e media", nameNl: "Content & media",
        icon: "file-text", order: 3,
        children: [
          { slug: "monetized-blog", nameEn: "Monetized Blog", nameRu: "Блог с монетизацией", nameFr: "Blog monétisé", nameEs: "Blog monetizado", namePt: "Blog monetizado", nameDe: "Monetarisierter Blog", nameIt: "Blog monetizzato", nameNl: "Gemonetiseerde blog", icon: "file-text", order: 1 },
          { slug: "youtube-channel", nameEn: "YouTube Channel", nameRu: "YouTube-канал", nameFr: "Chaîne YouTube", nameEs: "Canal de YouTube", namePt: "Canal do YouTube", nameDe: "YouTube-Kanal", nameIt: "Canale YouTube", nameNl: "YouTube-kanaal", icon: "file-text", order: 2 },
          { slug: "social-media-channel", nameEn: "Social Media Channel", nameRu: "Канал в соцсетях", nameFr: "Chaîne sur les réseaux sociaux", nameEs: "Canal de redes sociales", namePt: "Canal de redes sociais", nameDe: "Social-Media-Kanal", nameIt: "Canale social media", nameNl: "Social media kanaal", icon: "file-text", order: 3 },
          { slug: "podcast", nameEn: "Podcast", nameRu: "Подкаст", nameFr: "Podcast", nameEs: "Podcast", namePt: "Podcast", nameDe: "Podcast", nameIt: "Podcast", nameNl: "Podcast", icon: "file-text", order: 4 },
          { slug: "news-magazine", nameEn: "News Site / Online Magazine", nameRu: "Новостной сайт / онлайн-журнал", nameFr: "Site d'actualités / magazine en ligne", nameEs: "Sitio de noticias / revista online", namePt: "Site de notícias / revista online", nameDe: "Nachrichtenseite / Online-Magazin", nameIt: "Sito di notizie / rivista online", nameNl: "Nieuwssite / online magazine", icon: "file-text", order: 5 },
          { slug: "affiliate-site", nameEn: "Affiliate Site", nameRu: "Affiliate-сайт", nameFr: "Site affilié", nameEs: "Sitio de afiliados", namePt: "Site de afiliados", nameDe: "Affiliate-Seite", nameIt: "Sito di affiliazione", nameNl: "Affiliate site", icon: "file-text", order: 6 },
          { slug: "newsletter", nameEn: "Newsletter / Email List", nameRu: "Email-рассылка / Newsletter", nameFr: "Newsletter / liste email", nameEs: "Newsletter / lista de email", namePt: "Newsletter / lista de email", nameDe: "Newsletter / E-Mail-Liste", nameIt: "Newsletter / mailing list", nameNl: "Nieuwsbrief / e-maillijst", icon: "file-text", order: 7 },
        ],
      },
      {
        slug: "marketplaces", nameEn: "Marketplaces & Platforms", nameRu: "Маркетплейсы и платформы", nameFr: "Places de marché et plateformes", nameEs: "Marketplaces y plataformas", namePt: "Marketplaces e plataformas", nameDe: "Marktplätze & Plattformen", nameIt: "Marketplace e piattaforme", nameNl: "Marktplaatsen & platformen",
        icon: "store", order: 4,
        children: [
          { slug: "trading-marketplace", nameEn: "Trading Marketplace", nameRu: "Торговая площадка", nameFr: "Place de marché", nameEs: "Marketplace de comercio", namePt: "Marketplace de comércio", nameDe: "Handelsmarktplatz", nameIt: "Marketplace di scambio", nameNl: "Handelsmarktplaats", icon: "store", order: 1 },
          { slug: "service-marketplace", nameEn: "Service Marketplace", nameRu: "Маркетплейс услуг", nameFr: "Place de marché de services", nameEs: "Marketplace de servicios", namePt: "Marketplace de serviços", nameDe: "Dienstleistungsmarktplatz", nameIt: "Marketplace di servizi", nameNl: "Dienstenmarktplaats", icon: "store", order: 2 },
          { slug: "aggregator", nameEn: "Aggregator Platform", nameRu: "Агрегатор", nameFr: "Plateforme d'agrégation", nameEs: "Plataforma agregadora", namePt: "Plataforma agregadora", nameDe: "Aggregator-Plattform", nameIt: "Piattaforma aggregatore", nameNl: "Aggregator platform", icon: "store", order: 3 },
          { slug: "booking-platform", nameEn: "Booking Platform", nameRu: "Платформа бронирований", nameFr: "Plateforme de réservation", nameEs: "Plataforma de reservas", namePt: "Plataforma de reservas", nameDe: "Buchungsplattform", nameIt: "Piattaforma di prenotazione", nameNl: "Boekingsplatform", icon: "store", order: 4 },
        ],
      },
      {
        slug: "edtech", nameEn: "EdTech", nameRu: "EdTech", nameFr: "EdTech", nameEs: "EdTech", namePt: "EdTech", nameDe: "EdTech", nameIt: "EdTech", nameNl: "EdTech",
        icon: "graduation-cap", order: 5,
        children: [
          { slug: "online-school", nameEn: "Online School", nameRu: "Онлайн-школа", nameFr: "École en ligne", nameEs: "Escuela online", namePt: "Escola online", nameDe: "Online-Schule", nameIt: "Scuola online", nameNl: "Online school", icon: "graduation-cap", order: 1 },
          { slug: "lms-platform", nameEn: "LMS Platform", nameRu: "LMS-платформа", nameFr: "Plateforme LMS", nameEs: "Plataforma LMS", namePt: "Plataforma LMS", nameDe: "LMS-Plattform", nameIt: "Piattaforma LMS", nameNl: "LMS-platform", icon: "graduation-cap", order: 2 },
          { slug: "corporate-training", nameEn: "Corporate Training", nameRu: "Корпоративное обучение", nameFr: "Formation en entreprise", nameEs: "Formación corporativa", namePt: "Treinamento corporativo", nameDe: "Unternehmensschulung", nameIt: "Formazione aziendale", nameNl: "Bedrijfstraining", icon: "graduation-cap", order: 3 },
          { slug: "language-courses", nameEn: "Language Courses", nameRu: "Языковые курсы", nameFr: "Cours de langues", nameEs: "Cursos de idiomas", namePt: "Cursos de idiomas", nameDe: "Sprachkurse", nameIt: "Corsi di lingue", nameNl: "Taalcursussen", icon: "graduation-cap", order: 4 },
        ],
      },
      {
        slug: "fintech", nameEn: "Fintech", nameRu: "Финтех", nameFr: "Fintech", nameEs: "Fintech", namePt: "Fintech", nameDe: "Fintech", nameIt: "Fintech", nameNl: "Fintech",
        icon: "landmark", order: 6,
      },
      {
        slug: "mobile-apps", nameEn: "Mobile Apps", nameRu: "Мобильные приложения", nameFr: "Applications mobiles", nameEs: "Aplicaciones móviles", namePt: "Aplicativos móveis", nameDe: "Mobile Apps", nameIt: "App mobili", nameNl: "Mobiele apps",
        icon: "smartphone", order: 7,
      },
      {
        slug: "agencies", nameEn: "Agencies", nameRu: "Агентства", nameFr: "Agences", nameEs: "Agencias", namePt: "Agências", nameDe: "Agenturen", nameIt: "Agenzie", nameNl: "Bureaus",
        icon: "megaphone", order: 8,
        children: [
          { slug: "seo-agency", nameEn: "SEO / Digital Agency", nameRu: "SEO/Digital-агентство", nameFr: "Agence SEO / digitale", nameEs: "Agencia SEO / digital", namePt: "Agência SEO / digital", nameDe: "SEO-/Digitalagentur", nameIt: "Agenzia SEO / digitale", nameNl: "SEO / digitaal bureau", icon: "megaphone", order: 1 },
          { slug: "smm-agency", nameEn: "SMM Agency", nameRu: "SMM-агентство", nameFr: "Agence SMM", nameEs: "Agencia SMM", namePt: "Agência SMM", nameDe: "SMM-Agentur", nameIt: "Agenzia SMM", nameNl: "SMM-bureau", icon: "megaphone", order: 2 },
          { slug: "performance-agency", nameEn: "Performance Agency", nameRu: "Performance-агентство", nameFr: "Agence performance", nameEs: "Agencia de performance", namePt: "Agência de performance", nameDe: "Performance-Agentur", nameIt: "Agenzia performance", nameNl: "Performance bureau", icon: "megaphone", order: 3 },
          { slug: "web-studio", nameEn: "Web Development Studio", nameRu: "Веб-студия", nameFr: "Studio de développement web", nameEs: "Estudio de desarrollo web", namePt: "Estúdio de desenvolvimento web", nameDe: "Webentwicklungsstudio", nameIt: "Studio di sviluppo web", nameNl: "Webontwikkelingsstudio", icon: "megaphone", order: 4 },
        ],
      },
      {
        slug: "igaming", nameEn: "iGaming", nameRu: "iGaming", nameFr: "iGaming", nameEs: "iGaming", namePt: "iGaming", nameDe: "iGaming", nameIt: "iGaming", nameNl: "iGaming",
        icon: "gamepad-2", order: 9,
      },
    ],
  },
  {
    slug: "offline-business",
    nameEn: "Offline Business", nameRu: "Офлайн-бизнес", nameFr: "Entreprise physique", nameEs: "Negocio físico", namePt: "Negócio físico", nameDe: "Offline-Geschäft", nameIt: "Business fisico", nameNl: "Offline bedrijf",
    icon: "store", order: 2,
    children: [
      {
        slug: "horeca", nameEn: "HoReCa", nameRu: "Общепит (HoReCa)", nameFr: "HoReCa", nameEs: "HoReCa", namePt: "HoReCa", nameDe: "HoReCa", nameIt: "HoReCa", nameNl: "HoReCa",
        icon: "utensils-crossed", order: 1,
        children: [
          { slug: "fine-dining", nameEn: "Fine Dining Restaurant", nameRu: "Ресторан высокой кухни", nameFr: "Restaurant gastronomique", nameEs: "Restaurante de alta cocina", namePt: "Restaurante fine dining", nameDe: "Fine-Dining-Restaurant", nameIt: "Ristorante di alta cucina", nameNl: "Fine dining restaurant", icon: "utensils-crossed", order: 1 },
          { slug: "family-restaurant", nameEn: "Family Restaurant", nameRu: "Семейный ресторан", nameFr: "Restaurant familial", nameEs: "Restaurante familiar", namePt: "Restaurante familiar", nameDe: "Familienrestaurant", nameIt: "Ristorante familiare", nameNl: "Familierestaurant", icon: "utensils-crossed", order: 2 },
          { slug: "coffee-shop", nameEn: "Coffee Shop", nameRu: "Кофейня", nameFr: "Café / coffee shop", nameEs: "Cafetería", namePt: "Cafeteria", nameDe: "Café / Coffeeshop", nameIt: "Caffetteria", nameNl: "Koffiehuis", icon: "utensils-crossed", order: 3 },
          { slug: "fast-food", nameEn: "Fast Food", nameRu: "Фастфуд", nameFr: "Restauration rapide", nameEs: "Comida rápida", namePt: "Fast food", nameDe: "Fast Food", nameIt: "Fast food", nameNl: "Fastfood", icon: "utensils-crossed", order: 4 },
          { slug: "food-truck", nameEn: "Food Truck", nameRu: "Фудтрак", nameFr: "Food truck", nameEs: "Food truck", namePt: "Food truck", nameDe: "Food Truck", nameIt: "Food truck", nameNl: "Foodtruck", icon: "utensils-crossed", order: 5 },
          { slug: "dark-kitchen", nameEn: "Dark Kitchen / Ghost Kitchen", nameRu: "Dark kitchen", nameFr: "Dark kitchen", nameEs: "Cocina fantasma", namePt: "Dark kitchen", nameDe: "Dark Kitchen", nameIt: "Dark kitchen", nameNl: "Dark kitchen", icon: "utensils-crossed", order: 6 },
          { slug: "bar-nightclub", nameEn: "Bar / Nightclub", nameRu: "Бар / Ночной клуб", nameFr: "Bar / boîte de nuit", nameEs: "Bar / discoteca", namePt: "Bar / casa noturna", nameDe: "Bar / Nachtclub", nameIt: "Bar / discoteca", nameNl: "Bar / nachtclub", icon: "utensils-crossed", order: 7 },
          { slug: "bakery-pastry", nameEn: "Bakery / Pastry Shop", nameRu: "Пекарня / Кондитерская", nameFr: "Boulangerie / pâtisserie", nameEs: "Panadería / pastelería", namePt: "Padaria / confeitaria", nameDe: "Bäckerei / Konditorei", nameIt: "Panetteria / pasticceria", nameNl: "Bakkerij / banketbakkerij", icon: "utensils-crossed", order: 8 },
          { slug: "catering", nameEn: "Catering Company", nameRu: "Кейтеринговая компания", nameFr: "Entreprise de traiteur", nameEs: "Empresa de catering", namePt: "Empresa de catering", nameDe: "Catering-Unternehmen", nameIt: "Azienda di catering", nameNl: "Cateringbedrijf", icon: "utensils-crossed", order: 9 },
        ],
      },
      {
        slug: "retail", nameEn: "Retail", nameRu: "Розничная торговля", nameFr: "Commerce de détail", nameEs: "Comercio minorista", namePt: "Comércio varejista", nameDe: "Einzelhandel", nameIt: "Commercio al dettaglio", nameNl: "Detailhandel",
        icon: "shopping-bag", order: 2,
        children: [
          { slug: "clothing-store", nameEn: "Clothing Store", nameRu: "Магазин одежды", nameFr: "Magasin de vêtements", nameEs: "Tienda de ropa", namePt: "Loja de roupas", nameDe: "Bekleidungsgeschäft", nameIt: "Negozio di abbigliamento", nameNl: "Kledingwinkel", icon: "shopping-bag", order: 1 },
          { slug: "home-goods-store", nameEn: "Home Goods Store", nameRu: "Магазин товаров для дома", nameFr: "Magasin de décoration", nameEs: "Tienda para el hogar", namePt: "Loja para casa", nameDe: "Einrichtungshaus", nameIt: "Negozio per la casa", nameNl: "Woonwinkel", icon: "shopping-bag", order: 2 },
          { slug: "electronics-store", nameEn: "Electronics Store", nameRu: "Магазин электроники", nameFr: "Magasin d'électronique", nameEs: "Tienda de electrónica", namePt: "Loja de eletrônicos", nameDe: "Elektronikgeschäft", nameIt: "Negozio di elettronica", nameNl: "Elektronicawinkel", icon: "shopping-bag", order: 3 },
          { slug: "pet-store", nameEn: "Pet Store", nameRu: "Зоомагазин", nameFr: "Animalerie", nameEs: "Tienda de mascotas", namePt: "Pet shop", nameDe: "Zoohandlung", nameIt: "Negozio per animali", nameNl: "Dierenwinkel", icon: "shopping-bag", order: 4 },
          { slug: "grocery-store", nameEn: "Grocery Store", nameRu: "Продуктовый магазин", nameFr: "Épicerie", nameEs: "Tienda de alimentación", namePt: "Mercearia", nameDe: "Lebensmittelgeschäft", nameIt: "Alimentari", nameNl: "Supermarkt", icon: "shopping-bag", order: 5 },
          { slug: "pharmacy", nameEn: "Pharmacy / Optics", nameRu: "Аптека / Оптика", nameFr: "Pharmacie / optique", nameEs: "Farmacia / óptica", namePt: "Farmácia / ótica", nameDe: "Apotheke / Optik", nameIt: "Farmacia / ottica", nameNl: "Apotheek / optica", icon: "shopping-bag", order: 6 },
        ],
      },
      {
        slug: "b2c-services", nameEn: "B2C Services", nameRu: "Услуги для населения", nameFr: "Services B2C", nameEs: "Servicios B2C", namePt: "Serviços B2C", nameDe: "B2C-Dienstleistungen", nameIt: "Servizi B2C", nameNl: "B2C-diensten",
        icon: "scissors", order: 3,
        children: [
          { slug: "beauty-salon", nameEn: "Beauty Salon / Barbershop", nameRu: "Салон красоты / Барбершоп", nameFr: "Salon de beauté / barbier", nameEs: "Salón de belleza / barbería", namePt: "Salão de beleza / barbearia", nameDe: "Schönheitssalon / Barbershop", nameIt: "Salone di bellezza / barbiere", nameNl: "Schoonheidssalon / barbershop", icon: "scissors", order: 1 },
          { slug: "spa-wellness", nameEn: "SPA / Wellness", nameRu: "SPA / Велнес", nameFr: "SPA / bien-être", nameEs: "SPA / bienestar", namePt: "SPA / bem-estar", nameDe: "SPA / Wellness", nameIt: "SPA / benessere", nameNl: "SPA / wellness", icon: "scissors", order: 2 },
          { slug: "fitness-club", nameEn: "Fitness Club / Gym", nameRu: "Фитнес-клуб", nameFr: "Salle de sport", nameEs: "Gimnasio", namePt: "Academia", nameDe: "Fitnessstudio", nameIt: "Palestra", nameNl: "Sportschool", icon: "dumbbell", order: 3 },
          { slug: "dental-clinic", nameEn: "Dental Clinic", nameRu: "Стоматологическая клиника", nameFr: "Clinique dentaire", nameEs: "Clínica dental", namePt: "Clínica dentária", nameDe: "Zahnarztpraxis", nameIt: "Clinica dentale", nameNl: "Tandartspraktijk", icon: "heart", order: 4 },
          { slug: "medical-practice", nameEn: "Medical Practice", nameRu: "Частная клиника", nameFr: "Cabinet médical", nameEs: "Consulta médica", namePt: "Consultório médico", nameDe: "Arztpraxis", nameIt: "Studio medico", nameNl: "Artsenpraktijk", icon: "heart", order: 5 },
          { slug: "veterinary-clinic", nameEn: "Veterinary Clinic", nameRu: "Ветеринарная клиника", nameFr: "Clinique vétérinaire", nameEs: "Clínica veterinaria", namePt: "Clínica veterinária", nameDe: "Tierarztpraxis", nameIt: "Clinica veterinaria", nameNl: "Dierenkliniek", icon: "heart", order: 6 },
          { slug: "education-center", nameEn: "Education / Learning Center", nameRu: "Образовательный центр", nameFr: "Centre éducatif", nameEs: "Centro educativo", namePt: "Centro educacional", nameDe: "Bildungszentrum", nameIt: "Centro educativo", nameNl: "Opleidingscentrum", icon: "graduation-cap", order: 7 },
          { slug: "car-wash", nameEn: "Car Wash / Auto Service", nameRu: "Автомойка / Автосервис", nameFr: "Lavage auto / garage", nameEs: "Lavadero / taller", namePt: "Lava jato / oficina", nameDe: "Autowaschanlage / Werkstatt", nameIt: "Autolavaggio / officina", nameNl: "Autowasserette / garage", icon: "truck", order: 8 },
          { slug: "cleaning-company", nameEn: "Cleaning Company", nameRu: "Клининговая компания", nameFr: "Entreprise de nettoyage", nameEs: "Empresa de limpieza", namePt: "Empresa de limpeza", nameDe: "Reinigungsfirma", nameIt: "Impresa di pulizie", nameNl: "Schoonmaakbedrijf", icon: "scissors", order: 9 },
        ],
      },
      { slug: "real-estate", nameEn: "Real Estate & Construction", nameRu: "Недвижимость и строительство", nameFr: "Immobilier et construction", nameEs: "Inmobiliaria y construcción", namePt: "Imobiliário e construção", nameDe: "Immobilien & Bau", nameIt: "Immobiliare e costruzioni", nameNl: "Vastgoed & bouw", icon: "building-2", order: 4 },
      { slug: "manufacturing", nameEn: "Manufacturing", nameRu: "Производство", nameFr: "Industrie manufacturière", nameEs: "Manufactura", namePt: "Manufatura", nameDe: "Fertigung", nameIt: "Manifattura", nameNl: "Productie", icon: "factory", order: 5 },
      { slug: "wholesale", nameEn: "Wholesale & Distribution", nameRu: "Оптовая торговля", nameFr: "Commerce de gros", nameEs: "Comercio mayorista", namePt: "Atacado e distribuição", nameDe: "Großhandel", nameIt: "Commercio all'ingrosso", nameNl: "Groothandel", icon: "warehouse", order: 6 },
      { slug: "logistics", nameEn: "Logistics & Transport", nameRu: "Логистика и транспорт", nameFr: "Logistique et transport", nameEs: "Logística y transporte", namePt: "Logística e transporte", nameDe: "Logistik & Transport", nameIt: "Logistica e trasporti", nameNl: "Logistiek & transport", icon: "truck", order: 7 },
      { slug: "agriculture", nameEn: "Agriculture", nameRu: "Агросектор", nameFr: "Agriculture", nameEs: "Agricultura", namePt: "Agricultura", nameDe: "Landwirtschaft", nameIt: "Agricoltura", nameNl: "Landbouw", icon: "wheat", order: 8 },
      { slug: "entertainment", nameEn: "Entertainment & Leisure", nameRu: "Развлечения и досуг", nameFr: "Divertissement et loisirs", nameEs: "Entretenimiento y ocio", namePt: "Entretenimento e lazer", nameDe: "Unterhaltung & Freizeit", nameIt: "Intrattenimento e tempo libero", nameNl: "Entertainment & vrije tijd", icon: "ticket", order: 9 },
      { slug: "tourism", nameEn: "Tourism & Hospitality", nameRu: "Туризм и гостеприимство", nameFr: "Tourisme et hôtellerie", nameEs: "Turismo y hostelería", namePt: "Turismo e hotelaria", nameDe: "Tourismus & Gastgewerbe", nameIt: "Turismo e ospitalità", nameNl: "Toerisme & horeca", icon: "plane", order: 10 },
      { slug: "b2b-services", nameEn: "B2B Services", nameRu: "B2B-услуги", nameFr: "Services B2B", nameEs: "Servicios B2B", namePt: "Serviços B2B", nameDe: "B2B-Dienstleistungen", nameIt: "Servizi B2B", nameNl: "B2B-diensten", icon: "briefcase", order: 11 },
    ],
  },
  {
    slug: "franchises", nameEn: "Franchises", nameRu: "Франшизы", nameFr: "Franchises", nameEs: "Franquicias", namePt: "Franquias", nameDe: "Franchise", nameIt: "Franchising", nameNl: "Franchises",
    icon: "briefcase", order: 3,
    children: [
      { slug: "sell-own-franchise", nameEn: "Sell Own Franchise", nameRu: "Продажа собственной франшизы", nameFr: "Vente de franchise propre", nameEs: "Venta de franquicia propia", namePt: "Venda de franquia própria", nameDe: "Eigene Franchise verkaufen", nameIt: "Vendita franchising proprio", nameNl: "Eigen franchise verkopen", icon: "briefcase", order: 1 },
      { slug: "sell-franchise-unit", nameEn: "Sell Franchise Unit", nameRu: "Продажа точки франшизы", nameFr: "Vente d'unité de franchise", nameEs: "Venta de unidad de franquicia", namePt: "Venda de unidade de franquia", nameDe: "Franchise-Einheit verkaufen", nameIt: "Vendita unità franchising", nameNl: "Franchise-eenheid verkopen", icon: "briefcase", order: 2 },
      { slug: "master-franchise", nameEn: "Master Franchise", nameRu: "Мастер-франшиза", nameFr: "Master franchise", nameEs: "Master franquicia", namePt: "Master franquia", nameDe: "Master-Franchise", nameIt: "Master franchising", nameNl: "Master franchise", icon: "briefcase", order: 3 },
    ],
  },
  {
    slug: "startups", nameEn: "Startups", nameRu: "Стартапы", nameFr: "Startups", nameEs: "Startups", namePt: "Startups", nameDe: "Startups", nameIt: "Startup", nameNl: "Startups",
    icon: "rocket", order: 4,
    children: [
      { slug: "idea-mvp", nameEn: "Idea + MVP", nameRu: "Идея + MVP", nameFr: "Idée + MVP", nameEs: "Idea + MVP", namePt: "Ideia + MVP", nameDe: "Idee + MVP", nameIt: "Idea + MVP", nameNl: "Idee + MVP", icon: "rocket", order: 1 },
      { slug: "mvp-users", nameEn: "MVP + First Users", nameRu: "MVP + первые пользователи", nameFr: "MVP + premiers utilisateurs", nameEs: "MVP + primeros usuarios", namePt: "MVP + primeiros usuários", nameDe: "MVP + erste Nutzer", nameIt: "MVP + primi utenti", nameNl: "MVP + eerste gebruikers", icon: "rocket", order: 2 },
      { slug: "early-revenue", nameEn: "Early Revenue", nameRu: "Ранняя выручка", nameFr: "Revenus précoces", nameEs: "Ingresos tempranos", namePt: "Receita inicial", nameDe: "Frühe Einnahmen", nameIt: "Ricavi iniziali", nameNl: "Vroege omzet", icon: "rocket", order: 3 },
      { slug: "seed-stage", nameEn: "Seed Stage", nameRu: "Seed-стадия", nameFr: "Stade seed", nameEs: "Etapa seed", namePt: "Estágio seed", nameDe: "Seed-Phase", nameIt: "Fase seed", nameNl: "Seed fase", icon: "rocket", order: 4 },
    ],
  },
  {
    slug: "shares-partnership", nameEn: "Shares & Partnership", nameRu: "Доли и партнёрство", nameFr: "Parts et partenariats", nameEs: "Participaciones y asociaciones", namePt: "Participações e parcerias", nameDe: "Anteile & Partnerschaft", nameIt: "Quote e partnership", nameNl: "Aandelen & partnerschap",
    icon: "handshake", order: 5,
    children: [
      { slug: "minority-stake", nameEn: "Minority Stake Sale", nameRu: "Продажа миноритарной доли", nameFr: "Vente de parts minoritaires", nameEs: "Venta de participación minoritaria", namePt: "Venda de participação minoritária", nameDe: "Verkauf von Minderheitsanteilen", nameIt: "Vendita quota di minoranza", nameNl: "Verkoop minderheidsbelang", icon: "handshake", order: 1 },
      { slug: "majority-stake", nameEn: "Majority Stake Sale", nameRu: "Продажа мажоритарной доли", nameFr: "Vente de parts majoritaires", nameEs: "Venta de participación mayoritaria", namePt: "Venda de participação majoritária", nameDe: "Verkauf von Mehrheitsanteilen", nameIt: "Vendita quota di maggioranza", nameNl: "Verkoop meerderheidsbelang", icon: "handshake", order: 2 },
      { slug: "seeking-partner", nameEn: "Seeking Partner", nameRu: "Поиск партнёра", nameFr: "Recherche de partenaire", nameEs: "Búsqueda de socio", namePt: "Busca de parceiro", nameDe: "Partner gesucht", nameIt: "Ricerca partner", nameNl: "Partner gezocht", icon: "handshake", order: 3 },
      { slug: "asset-sale", nameEn: "Asset Sale", nameRu: "Продажа активов", nameFr: "Vente d'actifs", nameEs: "Venta de activos", namePt: "Venda de ativos", nameDe: "Verkauf von Vermögenswerten", nameIt: "Vendita di asset", nameNl: "Verkoop van activa", icon: "handshake", order: 4 },
    ],
  },
];

// ── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding database...\n");

  // 1. Create Users
  const userIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const [user] = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
      })
      .returning();
    userIds.push(user.id);
  }
  console.log(`✅ Created ${userIds.length} users`);

  // 2. Insert categories recursively
  const categorySlugToId: Record<string, string> = {};
  const level1Slugs: string[] = [];

  async function insertCategory(cat: CategorySeed, parentId?: string, depth = 0) {
    const [inserted] = await db
      .insert(categories)
      .values({
        slug: cat.slug,
        nameEn: cat.nameEn,
        nameRu: cat.nameRu,
        nameFr: cat.nameFr,
        nameEs: cat.nameEs,
        namePt: cat.namePt,
        nameDe: cat.nameDe,
        nameIt: cat.nameIt,
        nameNl: cat.nameNl,
        icon: cat.icon,
        order: cat.order,
        parentId: parentId ?? null,
      })
      .onConflictDoNothing()
      .returning();

    if (inserted) {
      categorySlugToId[cat.slug] = inserted.id;
      if (depth === 1) level1Slugs.push(cat.slug);

      if (cat.children) {
        for (const child of cat.children) {
          await insertCategory(child, inserted.id, depth + 1);
        }
      }
    }
  }

  for (const section of CATEGORIES) {
    await insertCategory(section);
  }
  console.log(`✅ Created ${Object.keys(categorySlugToId).length} categories (hierarchical)`);

  // 3. Create Listings (European data, EUR currency)
  const allCountryCodes = Object.keys(EUROPEAN_CITIES);

  // Use level-1 categories (the main browsable categories) for listings
  const assignableSlugs = level1Slugs.length > 0 ? level1Slugs : Object.keys(categorySlugToId);

  for (let i = 0; i < 24; i++) {
    const isOnline = i % 3 === 0;
    const countryCode = isOnline ? null : faker.helpers.arrayElement(allCountryCodes);
    const city = countryCode ? faker.helpers.arrayElement(EUROPEAN_CITIES[countryCode]) : null;
    const currency = countryCode ? (COUNTRY_CURRENCIES[countryCode] || "EUR") : "EUR";

    const catSlug = faker.helpers.arrayElement(assignableSlugs);
    const categoryId = categorySlugToId[catSlug];
    const userId = faker.helpers.arrayElement(userIds);

    const yearlyRevenue = faker.number.int({ min: 50000, max: 800000 });
    const yearlyProfit = Math.round(yearlyRevenue * faker.number.float({ min: 0.1, max: 0.5 }));
    const price = Math.round(yearlyProfit * faker.number.float({ min: 1.5, max: 5 }));

    const revenueData = Array.from({ length: 12 }).map((_, idx) => ({
      name: `Month ${idx + 1}`,
      value: Math.round(yearlyRevenue / 12 + faker.number.int({ min: -5000, max: 5000 })),
    }));

    const [listing] = await db
      .insert(listings)
      .values({
        userId,
        categoryId,
        title: faker.company.catchPhrase(),
        description: `
# Business Overview
${faker.lorem.paragraph()}

## Key Highlights
- **${faker.company.buzzPhrase()}**: ${faker.lorem.sentence()}
- **${faker.company.buzzPhrase()}**: ${faker.lorem.sentence()}
- **Established Brand**: Operating since ${faker.date.past({ years: 5 }).getFullYear()}

### Growth Opportunities
1. ${faker.company.catchPhrase()}
2. ${faker.company.catchPhrase()}
3. Expansion into new markets

## Reason for Selling
${faker.lorem.paragraph()}
        `.trim(),
        price: price.toString(),
        currency,
        country: isOnline ? null : countryCode,
        city: isOnline ? null : city,
        locationType: isOnline ? "online" : "offline",
        status: "active",
        yearlyRevenue: yearlyRevenue.toString(),
        yearlyProfit: yearlyProfit.toString(),
      })
      .returning();

    await db.insert(metrics).values({
      listingId: listing.id,
      type: "revenue",
      name: "Monthly Revenue",
      data: revenueData,
      unit: "€",
    });

    if (isOnline) {
      const usersData = Array.from({ length: 12 }).map((_, idx) => ({
        name: `Month ${idx + 1}`,
        value: faker.number.int({ min: 100, max: 10000 }),
      }));
      await db.insert(metrics).values({
        listingId: listing.id,
        type: "users",
        name: "Active Users",
        data: usersData,
        unit: "users",
      });
    }
  }
  console.log("✅ Created 24 listings with European data");

  console.log("\n🌱 Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
