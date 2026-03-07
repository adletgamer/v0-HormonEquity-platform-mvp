# InSight Health - Customization Guide

Quick reference for common customization tasks.

## 🎨 Brand Colors

### Change Primary Color (Teal → Your Color)

**File**: `app/globals.css`

Find and replace all instances:
```css
/* Current (Teal) */
--primary: oklch(0.52 0.12 195);

/* Replace with your color, e.g., Purple */
--primary: oklch(0.50 0.15 280);
```

Use this tool to generate OKLch colors: https://oklch.com/

### Change Accent Color (Warm Rose → Your Color)

```css
/* Current (Warm Rose) */
--accent: oklch(0.68 0.11 15);

/* Replace with your color, e.g., Coral */
--accent: oklch(0.65 0.13 40);
```

## 📝 Branding Text

### Company Name
**Files**:
- `app/page.tsx` (line 17 & many places): "InSight Health"
- `components/chat-interface.tsx` (line 127): "InSight Health"

Replace "InSight Health" with your company name globally.

### Logo Icon
**File**: `app/page.tsx` (line 16) & `components/chat-interface.tsx` (line 126)

Current: `<Heart className="w-6 h-6 text-accent fill-accent" />`

Replace `Heart` with any lucide-react icon:
```tsx
import { Heart, Stethoscope, Activity, Zap } from 'lucide-react';
// Use: <Stethoscope className="w-6 h-6 text-accent fill-accent" />
```

### Hero Message
**File**: `app/page.tsx` (lines 48-52)

Change:
```tsx
<h1>Your Perimenopause Companion, Not Your Judge</h1>
<p>Get personalized guidance for managing perimenopause and menopause symptoms...</p>
```

To your value proposition.

## 🗨️ Chat Conversation

### Add/Remove Chat Stages

**File**: `components/chat-interface.tsx` (lines 33-87)

Current flow: Welcome → Age → Symptoms → Medical History → Medications → Goals → Summary → Guidance

To **add a stage** after "Symptoms":
```typescript
{
  id: 'lifestyle',
  prompt: "What's your current lifestyle like? (exercise, stress, sleep)",
  field: 'lifestyle',
  followUp: null
}
```

Update the `ChatSession` interface to include `lifestyle?: string[]`

### Customize Chat Messages

Example - change "What's your name?" prompt:
```typescript
// Current (line 42)
prompt: "Hi there! I'm here to help you navigate your health journey. What's your name?"

// Change to:
prompt: "Welcome! I'm your health companion. What's your name?"
```

### Change Chat Response Delay

**File**: `components/chat-interface.tsx` (line 211)

```typescript
// Current: 800ms delay
await new Promise(resolve => setTimeout(resolve, 800));

// Change to 1500ms for longer delay:
await new Promise(resolve => setTimeout(resolve, 1500));
```

## 📄 Landing Page

### Modify Feature Cards

**File**: `app/page.tsx` (lines 141-152)

Change the features array:
```tsx
{
  icon: MessageSquare,
  title: "Conversational Intake",
  description: "Share your story naturally..."
}
```

### Update "How It Works" Steps

**File**: `app/page.tsx` (lines 180-192)

Each step has: `step`, `title`, `desc`

```tsx
{ 
  step: "1", 
  title: "Chat", 
  desc: "Tell us about your symptoms..." 
}
```

### Change CTA Button Text

Find `<Button>` elements and modify text:
```tsx
<Button>Start Your Journey</Button>  // Change text here
```

## 🎯 Navigation

### Add Header Links

**File**: `app/page.tsx` (lines 23-26)

```tsx
<nav className="hidden md:flex items-center gap-8">
  <Link href="#about">About</Link>  // Already there
  <Link href="#features">Features</Link>  // Already there
  <Link href="#how">How It Works</Link>  // Already there
  <Link href="/faq">FAQ</Link>  // Add new links like this
</nav>
```

### Add New Pages

Create new route:
```bash
# Create /app/about/page.tsx
# Add header link: <Link href="/about">About</Link>
```

## 🎨 Design Tweaks

### Change Border Radius

**File**: `app/globals.css` (line 24)

```css
/* Current: 0.625rem (10px) */
--radius: 0.625rem;

/* Rounder: 1rem (16px) */
--radius: 1rem;

/* Sharper: 0.375rem (6px) */
--radius: 0.375rem;
```

### Change Font

**File**: `app/layout.tsx` (lines 6-7)

```tsx
// Current
import { Geist, Geist_Mono } from 'next/font/google'

// Change to any Google Font
import { Inter, Poppins } from 'next/font/google'
const font = Poppins({ subsets: ['latin'] })

// Then update tailwind.config.ts fontFamily
```

### Add Box Shadow

**File**: `app/page.tsx` or component files

Add to any element:
```tsx
<Card className="shadow-lg">  // shadow-md, shadow-lg, shadow-xl
```

## 🔄 Chat Styling

### Change Message Bubble Colors

**File**: `components/chat-interface.tsx` (lines 260-271)

```tsx
// User message (currently primary color)
className={`... bg-primary text-primary-foreground ...`}

// Assistant message (currently card/border)
className={`... bg-card text-foreground border border-border ...`}
```

### Change Input Box Style

**File**: `components/chat-interface.tsx` (line 299)

```tsx
<Input
  className="flex-1 bg-card text-foreground border-border placeholder:text-foreground/50"
  // Change colors as needed
/>
```

## 📊 Content Updates

### Change Site Metadata

**File**: `app/layout.tsx` (lines 10-11)

```tsx
title: 'InSight Health - Your title here',
description: 'Your meta description here',
```

### Add Analytics

Vercel Analytics is already imported in `layout.tsx`. To use:
- Deploy to Vercel
- Analytics automatically captures data

## 🚀 Performance

### Optimize Images (When Added)

```tsx
import Image from 'next/image';

<Image 
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={400}
  height={300}
  priority  // For above-fold images
/>
```

### Lazy Load Components

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

## 🔗 External Links

### Add Social Links

**File**: `app/page.tsx` footer section

```tsx
<footer className="...">
  <div className="flex justify-center gap-4">
    <a href="https://twitter.com/yourhandle" target="_blank">Twitter</a>
    <a href="https://linkedin.com/company/yours" target="_blank">LinkedIn</a>
  </div>
</footer>
```

## 📱 Add App Icons

Replace these files in `/public`:
- `icon-light-32x32.png` - Light theme icon
- `icon-dark-32x32.png` - Dark theme icon
- `icon.svg` - SVG icon
- `apple-icon.png` - Apple touch icon

## ⚙️ Configuration

### Environment Variables

**File**: `.env.local` (create if doesn't exist)

```env
# For Phase 2+
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### TypeScript Strict Mode

**File**: `tsconfig.json`

Already enabled. To relax (not recommended):
```json
"strict": false
```

## 🧪 Testing Customizations

After making changes:
1. Run `pnpm dev`
2. Navigate to pages: `/` and `/chat`
3. Test mobile view (DevTools)
4. Test form submissions
5. Check console for errors

## 🎬 Common Customization Patterns

### Make Chat Required Field
**File**: `components/chat-interface.tsx`

Find the form submission:
```typescript
if (!input.trim() || !session || isLoading) return;
// Add validation logic here
```

### Add Loading Skeleton
**File**: `components/chat-interface.tsx`

Replace the Spinner with:
```tsx
<div className="animate-pulse bg-muted h-12 w-full rounded-md"></div>
```

### Add Toast Notifications
Already have `sonner` installed!

```tsx
import { toast } from 'sonner';

// Use:
toast.success('Assessment complete!');
toast.error('Something went wrong');
```

## 💡 Tips

1. **Use Tailwind classes** instead of custom CSS when possible
2. **Test responsive design** at all breakpoints: 320px, 768px, 1024px
3. **Use CSS variables** for colors to maintain consistency
4. **Keep components focused** - one responsibility each
5. **Check accessibility** - use axe DevTools browser extension

## 🆘 Troubleshooting

### Changes not showing?
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `Ctrl+C` then `pnpm dev`
- Hard refresh browser: `Ctrl+Shift+R`

### Styling looks wrong?
- Check Tailwind CSS is imported in component
- Verify class names are spelled correctly
- Use DevTools to inspect actual applied styles

### TypeScript errors?
- Run: `pnpm tsc --noEmit` to see all errors
- Check imports are correct
- Hover over red squiggles for details

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Lucide Icons**: https://lucide.dev/
- **Next.js**: https://nextjs.org/docs
- **OKLch Colors**: https://oklch.com/

## 🎉 Ready to Customize!

Use this guide to personalize InSight Health for your brand and audience. Start with colors and text, then add more advanced features as needed.

Good luck! 💚
