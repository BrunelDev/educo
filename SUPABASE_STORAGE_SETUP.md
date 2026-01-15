# Supabase Storage Configuration Guide

## Required Environment Variables

Add these variables to your `.env.local` (development) and production environment:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_BUCKET_NAME=educo-prod-storage
```

## How to Get Your Credentials

### 1. Supabase Project URL and Keys

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret! Server-side only)

### 2. Create Storage Bucket

1. In your Supabase project, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `educo-prod-storage`
   - **Public bucket**: ✅ **Yes** (for direct file access)
   - **File size limit**: 50MB (default) - adjust as needed
   - **Allowed MIME types**: Leave empty for all types
4. Click **Create bucket**

### 3. Set Bucket Permissions (Important!)

After creating the bucket, you need to set up RLS (Row Level Security) policies:

1. Click on your `educo-prod-storage` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **For full customization**
4. Create these policies:

**Policy 1: Allow authenticated uploads**

- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Target roles: `authenticated` and `service_role`
- USING expression: `true`
- WITH CHECK expression: `true`

**Policy 2: Allow public reads** (if you want files publicly accessible)

- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `anon` and `public`
- USING expression: `true`

Alternatively, if you want **completely public access** (simplest option):

1. Click on the bucket
2. Click **Configuration**
3. Toggle **Public bucket** to ON

## Environment Setup Checklist

### Development (`.env.local`)

```bash
# Copy these to your .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_BUCKET_NAME=educo-prod-storage
```

### Production

Add the same variables to your production environment:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & deploy → Environment
- **Railway/Render**: Environment Variables section

## Verification Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Storage Connection

Create a test file `test-supabase-storage.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testConnection() {
  const { data, error } = await supabase.storage
    .from("educo-prod-storage")
    .list();

  if (error) {
    console.error("❌ Connection failed:", error);
  } else {
    console.log("✅ Storage connection successful!");
    console.log("Files:", data);
  }
}

testConnection();
```

Run: `npx tsx test-supabase-storage.ts`

### 3. Test File Upload in App

1. Start development server: `npm run dev`
2. Navigate to any file upload feature (profile photo, meeting documents, etc.)
3. Upload a test file
4. Verify in Supabase dashboard:
   - Go to **Storage** → **educo-prod-storage** → **web-impact-cse**
   - You should see your uploaded file
5. Check browser console for the returned URL - it should look like:
   ```
   https://xxxxx.supabase.co/storage/v1/object/public/educo-prod-storage/web-impact-cse/1234567890-filename.pdf
   ```

## Troubleshooting

### Issue: "Invalid API key" error

- **Cause**: Wrong or missing Supabase credentials
- **Solution**: Double-check your environment variables match the values from Supabase dashboard

### Issue: "Row Level Security policy violation"

- **Cause**: Bucket policies not configured correctly
- **Solution**: Either make bucket fully public OR add proper RLS policies (see step 3 above)

### Issue: "Bucket not found"

- **Cause**: Wrong bucket name or bucket doesn't exist
- **Solution**: Verify `SUPABASE_BUCKET_NAME` matches the bucket name in Supabase dashboard

### Issue: Files upload but can't be accessed

- **Cause**: Bucket is private and you're using public URLs
- **Solution**: Either make bucket public OR use signed URLs in code:
  ```typescript
  const {
    data: { signedUrl },
  } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(fileKey, 3600); // 1 hour expiration
  ```

### Issue: CSP (Content Security Policy) blocking files

- **Cause**: Middleware CSP headers not updated
- **Solution**: Already fixed in `middleware.ts` - make sure to restart dev server

## Migration from Scaleway

### What Changed

- ✅ Removed AWS SDK dependencies
- ✅ Added Supabase JavaScript client
- ✅ Updated upload logic in `lib/s3-upload.ts`
- ✅ Updated CSP headers in `middleware.ts`
- ⚠️ **All existing code using `uploadToS3()` works unchanged** (17 files)

### Old Files Note

If you have files already uploaded to Scaleway:

- **Option 1**: Keep Scaleway running alongside Supabase temporarily
- **Option 2**: Manually re-upload important files through the app
- **Option 3**: Create a migration script to bulk transfer (if needed, ask for help)

### URL Format Change

**Old (Scaleway)**:

```
https://cse-impact.s3.fr-par.scw.cloud/web-impact-cse/file.pdf
```

**New (Supabase)**:

```
https://xxxxx.supabase.co/storage/v1/object/public/educo-prod-storage/web-impact-cse/file.pdf
```

## Security Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore` by default
2. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - only use server-side
3. **Use public anon key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) for client-side
4. **Rotate keys periodically** - every 90 days recommended
5. **Set up monitoring** - Check Supabase dashboard for unusual activity

## Support

For Supabase-specific issues:

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
