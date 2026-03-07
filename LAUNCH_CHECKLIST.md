# 🚀 Launch Checklist - InSight Health MVP

Use this checklist to prepare for launch.

## Phase 1 Testing (Before First Demo)

### Landing Page
- [ ] Landing page loads without errors
- [ ] All navigation links work
- [ ] "Start Your Journey" button navigates to chat
- [ ] Features section displays all 4 cards
- [ ] "How It Works" shows 4 steps
- [ ] Mobile view (375px width) looks good
- [ ] Tablet view (768px width) looks good
- [ ] Desktop view (1024px+) looks good
- [ ] All text is readable (no overlaps)
- [ ] Color scheme is appealing

### Chat Interface
- [ ] Chat page loads at `/chat`
- [ ] Initial greeting message appears
- [ ] Can type in input box
- [ ] Send button works
- [ ] Messages appear in correct colors (blue for user, gray for AI)
- [ ] Chat progresses through all 7 stages
- [ ] Summary displays at end of intake
- [ ] Back button resets conversation
- [ ] No console errors appear

### Mobile Chat
- [ ] Chat works on iPhone size (375px)
- [ ] Input box doesn't get hidden by keyboard
- [ ] Messages are readable on small screen
- [ ] Buttons are large enough to tap
- [ ] Scrolling is smooth
- [ ] Text size is readable

### Accessibility
- [ ] Can navigate with Tab key
- [ ] Button focus states are visible
- [ ] No keyboard traps
- [ ] Colors have sufficient contrast
- [ ] Text is readable (16px+)
- [ ] No flashing animations that could trigger seizures

## Branding & Content

### Company Branding
- [ ] Company name is correct everywhere
- [ ] Logo/icon displays correctly
- [ ] Brand colors match guidelines
- [ ] Tone of voice is consistent
- [ ] Landing page copy is updated
- [ ] Chat messages reflect brand voice

### Customization Applied
- [ ] Company name changed from "InSight Health"
- [ ] Primary color customized
- [ ] Accent color customized
- [ ] Logo updated (if applicable)
- [ ] Hero headline updated
- [ ] Feature descriptions updated
- [ ] Chat greeting customized

### Content Review
- [ ] Landing page copy is accurate
- [ ] Chat questions make sense
- [ ] No spelling errors
- [ ] No broken links
- [ ] All CTAs are clear
- [ ] Privacy messaging is present

## Security & Privacy

### Data Privacy
- [ ] No API calls happen during chat (Phase 1)
- [ ] Data doesn't persist across refreshes (Phase 1)
- [ ] Privacy notice displays in chat footer
- [ ] No third-party scripts collecting data
- [ ] No analytics code (or Google Analytics properly configured)

### GDPR/Privacy (If applicable)
- [ ] Privacy policy exists and is linked
- [ ] Terms of service exist and are linked
- [ ] Cookie notice (if needed)
- [ ] GDPR compliance reviewed

## Performance

### Speed
- [ ] Landing page loads in < 2 seconds
- [ ] Chat page loads in < 1 second
- [ ] Send message response in < 1 second
- [ ] No noticeable lag on mobile
- [ ] No console warnings

### Mobile Optimization
- [ ] Responsive at all breakpoints
- [ ] Touch targets are 48px minimum
- [ ] No horizontal scrolling
- [ ] Keyboard handling works correctly
- [ ] Performance good on slow 4G

## Browser Compatibility

- [ ] Chrome (latest) ✅
- [ ] Firefox (latest) ✅
- [ ] Safari (latest) ✅
- [ ] Edge (latest) ✅
- [ ] Mobile Safari (iOS 12+) ✅
- [ ] Chrome Mobile ✅

## SEO & Metadata

### Page Titles & Descriptions
- [ ] Landing page title is clear and includes keywords
- [ ] Landing page meta description is compelling
- [ ] Chat page title is appropriate
- [ ] Chat page meta description is set
- [ ] All titles are < 60 characters
- [ ] All descriptions are < 160 characters

### Open Graph (Social Sharing)
- [ ] og:title set
- [ ] og:description set
- [ ] og:image set (optional)
- [ ] Twitter card configured (optional)

## Analytics & Monitoring

- [ ] Analytics script installed (Google Analytics, Vercel Analytics, etc.)
- [ ] Track page views
- [ ] Track button clicks
- [ ] Track chat completion
- [ ] Error tracking configured

## Deployment

### Pre-Deployment
- [ ] Code committed to Git
- [ ] No console errors
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Local testing complete

### Deployment Configuration
- [ ] Environment variables set in production
- [ ] Domain/URL configured
- [ ] SSL certificate valid
- [ ] Redirects configured (if needed)
- [ ] CDN configured (if using)

### Post-Deployment
- [ ] Production URL loads without errors
- [ ] All pages accessible
- [ ] Forms submit correctly
- [ ] No console errors on production
- [ ] Mobile works on production URL

## Documentation

- [ ] README.md updated with your info
- [ ] Company name in docs updated
- [ ] Code comments are clear
- [ ] Customization guide reviewed
- [ ] Phase 2 roadmap reviewed
- [ ] Deployment instructions clear

## Stakeholder Review

- [ ] Product team approved
- [ ] Legal reviewed privacy/terms
- [ ] Marketing approved messaging
- [ ] Design approved look & feel
- [ ] Leadership approved for launch

## User Testing (Optional but Recommended)

### Small Group Test
- [ ] 5+ users tried the flow
- [ ] Timed how long it takes (target: 3-5 minutes)
- [ ] Asked for feedback
- [ ] Noted any confusion points
- [ ] Updated based on feedback

## Launch Day

### Morning Of
- [ ] Final production check
- [ ] Verify all systems operational
- [ ] Test chat flow end-to-end
- [ ] Check analytics dashboard

### Launch
- [ ] Deploy to production
- [ ] Monitor errors/performance
- [ ] Share with team
- [ ] Announce to stakeholders

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Respond to initial feedback
- [ ] Fix any immediate bugs
- [ ] Plan Phase 2 based on learnings

## Phase 2 Preparation (After Launch)

- [ ] Collect user feedback
- [ ] Analyze usage patterns
- [ ] Prioritize Phase 2 features
- [ ] Plan database schema
- [ ] Research AI providers (Claude, OpenAI)
- [ ] Begin Phase 2 development

## Success Criteria

**Phase 1 Success Looks Like:**
- ✅ Users complete the chat flow without confusion
- ✅ Average completion time: 3-5 minutes
- ✅ No major bugs reported
- ✅ Positive feedback on tone and design
- ✅ Users understand next steps
- ✅ Mobile experience is smooth
- ✅ No performance issues

## Quick Reference

### If Something Breaks
1. Check console for errors (F12)
2. Check TypeScript types (`pnpm tsc`)
3. Restart dev server (`Ctrl+C` then `pnpm dev`)
4. Clear browser cache (Ctrl+Shift+Del)
5. Check git status for uncommitted changes

### Common Issues
- **Chat not advancing**: Check browser console, clear cache
- **Colors look wrong**: Clear cache, check globals.css
- **Mobile layout broken**: Check viewport meta tag in layout.tsx
- **Buttons not working**: Check onClick handlers and route definitions

### Contact
- Issues? Check the documentation first
- Questions? Review inline code comments
- Need help? See PHASE1_README.md architecture

## Final Approval Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product | _____ | ____ | [ ] |
| Design | _____ | ____ | [ ] |
| Dev Lead | _____ | ____ | [ ] |
| Legal | _____ | ____ | [ ] |

## Go Live! 🎉

Once all checkboxes are complete, you're ready to launch!

Remember:
- Phase 1 is complete and production-ready
- Phase 2 (recommendations) comes next
- Phase 3 (booking) follows Phase 2
- User feedback will guide improvements

Good luck! 💚
