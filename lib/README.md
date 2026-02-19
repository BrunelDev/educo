# Fichiers de la bibliothèque (lib/)

Ce dossier contient les utilitaires, fonctions et configurations partagés dans toute l'application.

## Module d'Upload de Fichiers: `s3-upload.ts`

Le module `s3-upload.ts` est responsable de l'envoi de fichiers vers Supabase Storage. Il est conçu pour être utilisé côté serveur.

### Variables d'environnement requises

Avant d'utiliser ce module, configurez les variables d'environnement suivantes dans votre fichier `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: L'URL de votre projet Supabase (ex: `https://xxxxx.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Votre clé publique Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Votre clé service role Supabase (⚠️ gardez-la secrète!)
- `SUPABASE_BUCKET_NAME`: Le nom de votre bucket sur Supabase (défaut: `educo-prod-storage`)

**Note**: Pour obtenir ces identifiants, consultez le guide de configuration: `SUPABASE_STORAGE_SETUP.md`

### Utilisation

```typescript
import { uploadToS3 } from "@/lib/s3-upload";

// Upload un ou plusieurs fichiers
const files: File[] = [file1, file2];
const urls: string[] = await uploadToS3(files);

;
// URLs publiques des fichiers uploadés sur Supabase Storage
```

### Fonction `uploadToS3`

### Signature

```typescript
export async function uploadToS3(files: File[]): Promise<string[]>;
```

### Description

Cette fonction asynchrone prend un tableau d'objets `File` et les téléverse sur le bucket S3 configuré.

### Paramètres

- `files` (`File[]`): Un tableau d'objets `File` à téléverser.

### Retour

- `Promise<string[]>`: Une promesse qui se résout en un tableau d'URLs. Chaque URL correspond à un fichier téléversé et est encodée pour être utilisée en toute sécurité dans des contextes web.

### Fonctionnement

4.  **Téléversement** : Le contenu du fichier est lu en tant que `ArrayBuffer`, puis converti en `Buffer` et envoyé au bucket S3 via la commande `PutObjectCommand`. Le `ContentType` (type MIME) du fichier est également défini.
5.  **Génération de l'URL** : Après un téléversement réussi, l'URL publique du fichier est construite.
6.  **Encodage de l'URL** : L'URL est encodée avec `encodeURI` pour s'assurer qu'elle est valide.
7.  **Résultat** : La fonction attend que toutes les promesses de téléversement soient résolues et retourne un tableau contenant toutes les URLs des fichiers téléversés.

### Gestion des erreurs

Si une erreur se produit pendant le téléversement d'un fichier, l'erreur est logguée dans la console et propagée, ce qui entraînera l'échec de `Promise.all`.
