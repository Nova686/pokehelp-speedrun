const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const step = (title, subs = [], notes = "") =>
  ({ title, subs, ...(notes ? { notes } : {}) });

async function main() {
  await prisma.rating.deleteMany();
  await prisma.speedrunRoute.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all(
    [
      { name: "Ash Ketchum", email: "ash@ketchum.com", password: "pikachu123" },
      { name: "Misty",        email: "misty@example.com", password: "starmie123" },
      { name: "Brock",        email: "brock@example.com", password: "onix123" },
    ].map(async (u) => {
      const passwordHash = await bcrypt.hash(u.password, 10);
      return prisma.user.create({
        data: { name: u.name, email: u.email.toLowerCase(), passwordHash },
      });
    })
  );

  const byEmail = Object.fromEntries(users.map(u => [u.email, u]));

  const routesData = [
    {
      game: "Pokémon Rouge",
      title: "Any% Kanto (RBY) — route standard",
      description: "Terminer la Ligue au plus tôt. Menuing agressif, combats minimaux.",
      steps: [
        step("Départ — Bourg Palette", [
          "Options: Texte Rapide, Animations OFF, Style SET",
          "Potion dans le PC",
          "Route 1 vers Jadielle"
        ]),
        step("Argenta", ["Acheter 3 Potions", "Pierre (safe strat Bulbizarre)"]),
        step("Azuria", ["Rival du Pont", "Optimisation d’XP", "Ondine (backups)"]),
        step("Ligue", ["Chemin court", "Economiser les PP", "Elites en enchaînement"]),
      ],
      author: "ash@example.com",
    },
    {
      game: "Pokémon Or",
      title: "Glitchless Any% Johto",
      description: "Parcours Or/Argent sans glitchs. Gestion stricte des objets et de l’XP.",
      steps: [
        step("Bourg Geai", ["Prendre Héricendre", "Livrer le paquet", "Retour labo"]),
        step("Mauville / Falkner", ["Itinéraire safe", "Plan anti-crit Rival"]),
        step("Rosalia / Mortimer", ["Tour Chetiflor skip", "Gestion Hypnose"]),
        step("Ligue", ["Routes optimisées", "Elixirs et Guérisons"]),
      ],
      author: "misty@example.com",
    },
    {
      game: "Pokémon Platine",
      title: "Débutant — Sinnoh Safe Route",
      description: "Itinéraire pédagogique (plus d’objets/soins, combats en plus).",
      steps: [
        step("Littorella → Féli-Cité", ["Objets clés", "Soins au Centre", "XP supplémentaire"]),
        step("Vestigion", ["Achats Potions/Antidotes", "Sécuriser la Forêt"]),
        step("Unionpolis", ["Passages sans risques", "Arrêts Centre fréquents"]),
        step("Ligue", ["Gestion PP et objets", "Backups sur Pokémon Clés"]),
      ],
      author: "brock@example.com",
    },
    {
      game: "Pokémon Noir 2",
      title: "Any% Unys (B2W2) — route courte",
      description: "Route compacte pour apprentissage des splits Unys.",
      steps: [
        step("Avenue des Artisans", ["Tutos rapides", "Optimiser les déplacements"]),
        step("Ondine / Cheren", ["Match-ups favorables", "Objets avant arènes"]),
        step("Route 4 → Méanville", ["Eviter dresseurs", "Gestion des repousse"]),
        step("Ligue", ["Préparatifs finaux", "RNG backups"]),
      ],
      author: "ash@example.com",
    },
    {
      game: "Pokémon Rubis Oméga",
      title: "Glitchless Any% Hoenn (ORAS)",
      description: "Sans glitchs, avec repousse et optimisation des talents.",
      steps: [
        step("Bourg-en-Vol", ["Starter optimal", "Premiers achats"]),
        step("Cramois’Île", ["Itinéraire surf", "Objets de sécurité"]),
        step("Atalanopolis", ["Split météo", "Elites équilibrées"]),
        step("Ligue", ["Gestion baies", "Ordre des Elites"]),
      ],
      author: "misty@example.com",
    },
    {
      game: "Pokémon Épée",
      title: "Any% Galar — route standard",
      description: "Route moderne avec dynamax géré, magasins et taxi Vol.",
      steps: [
        step("Pencamp", ["Briefing Hop", "Objets de départ"]),
        step("Old Chister", ["Arènes 1–4", "Achats ciblés"]),
        step("Kickenham", ["Arènes 5–7", "Taxi et shops"]),
        step("Ligue", ["Championnat", "Backups finaux"]),
      ],
      author: "brock@example.com",
    },
  ];

  const createdRoutes = [];
  for (const r of routesData) {
    const user = byEmail[r.author.toLowerCase()];
    createdRoutes.push(await prisma.speedrunRoute.create({
      data: {
        game: r.game,                   
        title: r.title,
        description: r.description,
        steps: r.steps,                 
        createdBy: user ? user.id : "anonymous",
      },
    }));
  }

  const ratings = [
    { email: "misty@example.com", routeTitle: "Any% Kanto (RBY) — route standard", value: 5 },
    { email: "brock@example.com", routeTitle: "Any% Kanto (RBY) — route standard", value: 4 },
    { email: "ash@example.com",   routeTitle: "Glitchless Any% Johto",               value: 4 },
    { email: "brock@example.com", routeTitle: "Glitchless Any% Johto",               value: 5 },
    { email: "ash@example.com",   routeTitle: "Débutant — Sinnoh Safe Route",        value: 5 },
    { email: "misty@example.com", routeTitle: "Débutant — Sinnoh Safe Route",        value: 4 },
  ];

  for (const r of ratings) {
    const u = byEmail[r.email];
    const route = createdRoutes.find(x => x.title === r.routeTitle);
    if (u && route) {
      await prisma.rating.create({
        data: { value: r.value, userId: u.id, routeId: route.id },
      });
    }
  }

  console.log("✅ Seed OK");
  console.log("Comptes :");
  console.log("- ash@example.com / pikachu123");
  console.log("- misty@example.com / starmie123");
  console.log("- brock@example.com / onix123");
  console.log("Routes créées (avec game) :", createdRoutes.map(r => `${r.title} [${r.game}]`));
}

main()
  .catch((e) => { console.error("❌ Seed error", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
