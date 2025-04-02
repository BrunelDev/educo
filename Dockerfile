# Étape 1 : Construction des dépendances
FROM oven/bun:1.1.29-alpine AS build
WORKDIR /app

# Copier le package.json et le bun.lockb pour installer les dépendances
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copier tout le code source dans l'image de construction
COPY . .

# Étape 2 : Build de l'application Next.js
RUN bun run build  # Ajout du build ici, tu peux aussi utiliser `next build` si nécessaire

# Étape 3 : Création de l'image de production
FROM oven/bun:1.1.29-alpine AS production

# Créer un utilisateur non privilégié
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Répertoire de travail pour l'application
WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=build /app ./

# Configuration de l'environnement de production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Lancer l'application en production
CMD ["bun", "run", "start"]
