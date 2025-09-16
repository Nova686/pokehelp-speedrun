const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const step = (title, subs = [], notes = "") =>
  ({ title, subs, ...(notes ? { notes } : {}) });

async function main() {
  await prisma.rating.deleteMany();
  await prisma.speedrunRoute.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { name: "Ash Ketchum", email: "ash@ketchum.com",   password: "pikachu123" },
    { name: "Misty",        email: "misty@example.com", password: "starmie123" },
    { name: "Brock",        email: "brock@example.com", password: "onix123" },
  ];

  const users = [];
  for (const u of usersData) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: { name: u.name, email: u.email.toLowerCase(), passwordHash },
    });
    users.push(user);
  }
  const byEmail = Object.fromEntries(users.map(u => [u.email, u]));

  const routesData = [
    {
      game: "Pokémon Rouge",
      title: "Any% Kanto (RBY)",
      description: "Terminer la Ligue au plus tôt avec menuing agressif et combats minimaux.",
      steps: [
        step("Bourg Palette → Jadielle", ["Potion PC", "Options: Texte Rapide, Anim OFF, Style SET"]),
        step("Argenta", ["Acheter 3 Potions", "Pierre — safe strat Bulbizarre"]),
        step("Azuria", ["Rival du Pont", "Ondine (backups selon RNG)"]),
        step("Ligue", ["Chemin court", "Économie de PP"]),
      ],
      author: "ash@ketchum.com",
    },
    {
      game: "Pokémon Or",
      title: "Glitchless Any% Johto",
      description: "Parcours sans glitchs, gestion stricte des objets et de l'XP.",
      steps: [
        step("Bourg Geai", ["Prendre Héricendre", "Livrer le paquet", "Retour labo"]),
        step("Mauville / Falkner", ["XP optimisée", "Plan anti-crit rival"]),
        step("Rosalia / Mortimer", ["Tour Chétiflor skip", "Gestion Hypnose"]),
        step("Ligue", ["Élixirs, Guérisons, routing final"]),
      ],
      author: "misty@example.com",
    },
    {
      game: "Pokémon Platine",
      title: "Sinnoh — Route Débutant (safe)",
      description: "Itinéraire pédagogique avec soins et objets supplémentaires.",
      steps: [
        step("Littorella → Féli-Cité", ["Objets clés", "Soins au Centre", "XP supplémentaire"]),
        step("Vestigion", ["Achat Potions/Antidotes", "Sécuriser la Forêt"]),
        step("Unionpolis", ["Passages low-risk", "Arrêts Centre fréquents"]),
        step("Ligue", ["Gestion PP", "Backups sur Pokémon clés"]),
      ],
      author: "brock@example.com",
    },
    {
      game: "Pokémon Noir 2",
      title: "Any% Unys (B2W2) — route courte",
      description: "Route compacte pour apprentissage des splits Unys.",
      steps: [
        step("Aspertia → Flocombe", ["Tutos rapides", "Optimiser déplacements"]),
        step("Méanville", ["Éviter dresseurs", "Gestion repousse"]),
        step("Ligue", ["Préparatifs finaux", "RNG backups"]),
      ],
      author: "ash@ketchum.com",
    },
    {
      game: "Pokémon Rubis Oméga",
      title: "Glitchless Any% Hoenn (ORAS)",
      description: "Sans glitchs, repousse + optimisation talents.",
      steps: [
        step("Bourg-en-Vol", ["Starter optimal", "Premiers achats"]),
        step("Cramois’Île", ["Itinéraire surf", "Objets sécurité"]),
        step("Atalanopolis", ["Split météo", "Équilibrer Élites"]),
        step("Ligue", ["Gestion baies", "Ordre des Élites"]),
      ],
      author: "misty@example.com",
    },
    {
      game: "Pokémon Épée",
      title: "Any% Galar — standard",
      description: "Route moderne (dynamax), magasins et taxi Vol.",
      steps: [
        step("Pencamp", ["Briefing Hop", "Objets départ"]),
        step("Old Chister", ["Arènes 1–4", "Achats ciblés"]),
        step("Kickenham", ["Arènes 5–7", "Taxi et shops"]),
        step("Ligue", ["Championnat", "Backups finaux"]),
      ],
      author: "brock@example.com",
    },
  ];

  const createdRoutes = [];
  for (const r of routesData) {
    const author = byEmail[r.author.toLowerCase()];
    if (!author) {
      throw new Error(`Auteur introuvable pour la route "${r.title}": ${r.author}`);
    }
    const created = await prisma.speedrunRoute.create({
      data: {
        game: r.game,
        title: r.title,
        description: r.description,
        steps: r.steps,
        user: { connect: { id: author.id } },
      },
    });
    createdRoutes.push(created);
  }

  const ratings = [
    { email: "misty@example.com", routeTitle: "Any% Kanto (RBY)",                 value: 5 },
    { email: "brock@example.com", routeTitle: "Any% Kanto (RBY)",                 value: 4 },
    { email: "ash@ketchum.com",   routeTitle: "Glitchless Any% Johto",            value: 4 },
    { email: "brock@example.com", routeTitle: "Glitchless Any% Johto",            value: 5 },
    { email: "ash@ketchum.com",   routeTitle: "Sinnoh — Route Débutant (safe)",   value: 5 },
    { email: "misty@example.com", routeTitle: "Sinnoh — Route Débutant (safe)",   value: 4 },
    { email: "ash@ketchum.com",   routeTitle: "Any% Galar — standard",            value: 4 },
  ];

  for (const r of ratings) {
    const u = byEmail[r.email.toLowerCase()];
    const route = createdRoutes.find(x => x.title === r.routeTitle);
    if (!u || !route) continue;
    await prisma.rating.create({
      data: { value: r.value, userId: u.id, routeId: route.id },
    });
  }

  console.log("✅ Seed OK");
  console.log("Comptes :");
  usersData.forEach(u => console.log(`- ${u.email} / ${u.password}`));
  console.log("Routes créées :");
  createdRoutes.forEach(r => console.log(`- ${r.title} [${r.game}] (author=${r.createdBy})`));
}

main()
  .catch((e) => { console.error("❌ Seed error", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
