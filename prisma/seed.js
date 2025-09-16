/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  await prisma.rating.deleteMany();
  await prisma.speedrunRoute.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { name: "Ash Ketchum", email: "ash@example.com", password: "pikachu123" },
    { name: "Misty", email: "misty@example.com", password: "starmie123" },
    { name: "Brock", email: "brock@example.com", password: "onix123" }
  ];

  const users = [];
  for (const u of usersData) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: { name: u.name, email: u.email.toLowerCase(), passwordHash }
    });
    users.push(created);
  }

  const step = (title, subs = [], notes = "") => ({ title, subs, ...(notes ? { notes } : {}) });

  const routesData = [
    {
      title: "Any% Kanto (RBY)",
      description:
        "Route rapide pour terminer la Ligue au plus tôt. Menuing agressif, combats minimaux.",
      steps: [
        step(
          "Départ — Bourg Palette",
          [
            "Options: Texte Rapide, Animations OFF, Style SET",
            "Potion dans le PC",
            "Sortir et se diriger vers Route 1"
          ],
          "Si RNG défavorable, reprendre la Potion"
        ),
        step("Argenta", ["Acheter 3 Potions", "Pierre - choisir Bulbizarre safe strat"]),
        step("Azuria", ["Rival sur le Pont", "Majorité de Dresseurs évités", "Ondine avec stratégies de backup"]),
        step("Ligue", ["Chemin le plus court", "Economiser les PP", "Elites en enchaînement"])
      ],
      author: "ash@example.com"
    },
    {
      title: "Glitchless Any% Johto",
      description:
        "Parcours Or/Argent sans glitchs. Gestion stricte des objets et de l’XP.",
      steps: [
        step("Bourg Geai", ["Prendre Cyndaquil", "Livrer le paquet", "Retour au labo"]),
        step("Falkner", ["Sables mouvants évités", "Rival: plan anti-crit"]),
        step("Mortimer", ["Tour Chetiflor skip", "Bis de strat Hypnose"]),
        step("Ligue", ["Routes optimisées", "Objets: Guérison, Elixirs"])
      ],
      author: "misty@example.com"
    },
    {
      title: "Route Débutant — Kanto Safe",
      description:
        "Itinéraire ultra-safe pour apprendre (plus d’objets, plus de soins, combats supplémentaires).",
      steps: [
        step("Bourg Palette → Jadielle", ["Potion PC", "Soins au Centre", "Ramasser les Baies"]),
        step("Argenta", ["Farmer un niveau supplémentaire", "Acheter Potions/Antidotes"]),
        step("Azuria", ["Passages sans risques", "Plusieurs arrêts au Centre"]),
        step("Carmin sur Mer", ["Gestion de la foudre", "Maître d’Arène safe strat"])
      ],
      author: "brock@example.com"
    }
  ];

  const routes = [];
  for (const r of routesData) {
    const user = users.find((u) => u.email === r.author.toLowerCase());
    const created = await prisma.speedrunRoute.create({
      data: {
        title: r.title,
        description: r.description,
        steps: r.steps,
        createdBy: user ? user.id : "anonymous"
      }
    });
    routes.push(created);
  }

  const ratingsToCreate = [
    { email: "misty@example.com", routeTitle: "Any% Kanto (RBY)", value: 5 },
    { email: "brock@example.com", routeTitle: "Any% Kanto (RBY)", value: 4 },
    { email: "ash@example.com", routeTitle: "Glitchless Any% Johto", value: 4 },
    { email: "brock@example.com", routeTitle: "Glitchless Any% Johto", value: 5 },
    { email: "ash@example.com", routeTitle: "Route Débutant — Kanto Safe", value: 5 },
    { email: "misty@example.com", routeTitle: "Route Débutant — Kanto Safe", value: 4 }
  ];

  for (const r of ratingsToCreate) {
    const user = users.find((u) => u.email === r.email);
    const route = routes.find((x) => x.title === r.routeTitle);
    if (user && route) {
      await prisma.rating.create({
        data: { value: r.value, userId: user.id, routeId: route.id }
      });
    }
  }

  console.log("✅ Seed OK");
  console.log("Comptes de test :");
  for (const u of usersData) {
    console.log(`- ${u.email} / ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
