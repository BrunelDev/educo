# Documentation du module d'upload S3

Ce document fournit une brève explication du fichier `s3-upload.ts`.

## Objectif

Le module `s3-upload.ts` est responsable de l'envoi de fichiers vers un bucket S3 compatible, spécifiquement configuré pour Scaleway Object Storage. Il est conçu pour être utilisé côté serveur.

## Configuration

Ce module nécessite les variables d'environnement suivantes pour fonctionner correctement :

- `SCALEWAY_REGION`: La région de votre bucket Scaleway (ex: `fr-par`).
- `SCALEWAY_ACCESS_KEY_ID`: Votre clé d'accès Scaleway.
- `SCALEWAY_SECRET_ACCESS_KEY`: Votre clé d'accès secrète Scaleway.
- `SCALEWAY_BUCKET_NAME`: Le nom de votre bucket sur Scaleway.

Ces variables sont utilisées pour configurer le client S3.

## Fonction `uploadToS3`

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

1.  **Initialisation du client S3** : Un client S3 est créé avec les informations d'identification et de région de Scaleway.
2.  **Gestion des fichiers** : La fonction `uploadToS3` mappe chaque fichier du tableau d'entrée.
3.  **Génération de la clé** : Pour chaque fichier, une clé unique est générée en utilisant le timestamp actuel et le nom original du fichier pour éviter les collisions. Le préfixe `web-impact-cse/` est ajouté.
4.  **Téléversement** : Le contenu du fichier est lu en tant que `ArrayBuffer`, puis converti en `Buffer` et envoyé au bucket S3 via la commande `PutObjectCommand`. Le `ContentType` (type MIME) du fichier est également défini.
5.  **Génération de l'URL** : Après un téléversement réussi, l'URL publique du fichier est construite.
6.  **Encodage de l'URL** : L'URL est encodée avec `encodeURI` pour s'assurer qu'elle est valide.
7.  **Résultat** : La fonction attend que toutes les promesses de téléversement soient résolues et retourne un tableau contenant toutes les URLs des fichiers téléversés.

### Gestion des erreurs

Si une erreur se produit pendant le téléversement d'un fichier, l'erreur est logguée dans la console et propagée, ce qui entraînera l'échec de `Promise.all`.
