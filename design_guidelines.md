# Design Guidelines: Academic Average Calculator

## Design Approach
**System-Based Approach**: Material Design principles adapted for mobile-first utility application. Focus on efficiency, clarity, and instant feedback for rapid grade entry and calculation.

## Core Design Principles
1. **Mobile-First**: Optimize for phone usage with thumb-friendly tap targets
2. **Instant Feedback**: Auto-calculate and auto-save with visual confirmation
3. **Minimal Friction**: Single-page flow, no authentication barriers
4. **Scannable Layout**: Clear visual hierarchy for quick grade entry

---

## Typography System

**Font Family**: 
- Primary: Inter or Roboto (via Google Fonts CDN)
- Fallback: system-ui, -apple-system, sans-serif

**Hierarchy**:
- App Title: text-2xl font-bold (mobile), text-3xl (desktop)
- Section Headers: text-xl font-semibold
- Subject Names: text-base font-medium
- Labels: text-sm font-medium
- Helper Text: text-xs
- Final Average Display: text-6xl font-extrabold (mobile), text-7xl (desktop)

---

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4 (mobile), p-6 (desktop)
- Section gaps: gap-4
- Form field spacing: space-y-4
- Card margins: mb-4

**Container Strategy**:
- Mobile: Full-width with px-4 edge padding
- Desktop: max-w-4xl centered with px-6

**Grid System**:
- Mobile: Single column (grid-cols-1)
- Tablet: Two columns for grade inputs (grid-cols-2)
- Desktop: Keep single column for subjects, use grid inside cards

---

## Component Library

### Primary Layout Structure

**Single-Page Scroll Layout**:
1. Sticky Header (h-16)
   - App title
   - Auto-save status indicator (top-right)
   - Total coefficient count

2. Subject Cards Stack
   - Expandable/collapsible per subject
   - Each card: rounded-xl, shadow-md
   - Active card: ring-2 for focus state

3. Floating Results Bar (sticky bottom on mobile)
   - Always visible final average
   - Quick tap to see breakdown

### Subject Input Cards

**Structure**:
```
┌─────────────────────────────────┐
│ Subject Name          Coef: X   │
│ ─────────────────────────────── │
│ [TD Input] [TP Input] [Ex Input]│
│ Current Avg: XX.XX ✓ Saved      │
└─────────────────────────────────┘
```

**Input Components**:
- Large touch targets: h-12 (48px minimum)
- Number inputs with step=0.5 for faster entry
- Immediate calculation on blur/change
- Success checkmark when saved
- Clear visual focus states (ring-2)

### Auto-Save Indicator

**Fixed Position (top-right on mobile)**:
- Idle: "All saved" with checkmark icon
- Saving: Spinner animation "Saving..."
- Error: Warning icon with retry option
- Use 400ms delay after last input before saving

### Results Display

**Mobile: Bottom Sheet Pattern**:
- Fixed bottom bar showing final average
- Swipe up to reveal detailed breakdown
- Height: h-20 collapsed, full-sheet expanded

**Desktop: Side Panel**:
- Sticky right column (1/3 width)
- Real-time updating cards per subject
- Visual equation display (coefficient weights)

### Individual Subject Result Cards

**Compact Display**:
- Subject name + calculated average
- Mini equation: "(TD×0.4 + Ex×0.6)"
- Weighted contribution to final grade
- Pass/fail indicator (if ≥10)

---

## Mobile Optimization

**Critical Mobile Patterns**:

1. **Quick Entry Mode**: 
   - Numeric keyboard auto-focus
   - Next/Done keyboard navigation
   - Swipe between subjects

2. **One-Handed Operation**:
   - All inputs in thumb zone (bottom 2/3)
   - Large tap targets (min 44×44px)
   - Bottom-anchored primary actions

3. **Minimal Scrolling**:
   - Accordion-style subject cards (expand one at a time)
   - Sticky results summary at bottom
   - Jump-to-subject quick nav

4. **Input Optimization**:
   - inputmode="decimal" for proper keyboard
   - Autofocus on first empty field
   - Clear button for quick reset per field

---

## Interaction Patterns

**Auto-Calculate Triggers**:
- On input blur (after user leaves field)
- Debounced 500ms after typing stops
- Immediate visual feedback (shimmer effect)

**Auto-Save Behavior**:
- 800ms debounce after last input
- Optimistic UI (show saved immediately)
- Silent background save to database
- Toast notification only on error

**Visual Feedback**:
- Input validation: Subtle border state changes
- Calculation: Brief pulse animation on result
- Save confirmation: Checkmark fade-in
- Error states: Gentle shake animation

---

## Form Validation

**Real-Time Validation**:
- Range: 0-20 enforced
- Invalid: ring-red-500 border
- Valid: subtle green checkmark
- Empty: neutral state (no validation)

**Error Messages**:
- Inline below input: text-xs text-red-600
- Non-blocking (doesn't prevent calculation)
- Auto-dismiss when corrected

---

## Accessibility

**Keyboard Navigation**:
- Tab order: sequential through subjects
- Enter to calculate/save
- Escape to clear current card

**Screen Readers**:
- Label associations for all inputs
- Live regions for calculation updates
- Status announcements for auto-save

**Touch Targets**:
- Minimum 44×44px (iOS) / 48×48px (Android)
- Adequate spacing between interactive elements (min 8px)

---

## Database Integration (Anonymous)

**Save Format**:
- Session identifier (browser fingerprint + timestamp)
- Subject grades array
- Final calculated average
- Submission timestamp

**No Login Required**:
- Store data immediately on first input
- Update on each auto-save
- Optional: Share link for result retrieval

---

## Performance Considerations

- Debounced calculations to prevent excessive updates
- LocalStorage backup before DB save
- Optimistic UI updates
- Lazy load formula explanations

---

## Additional Features

**Quick Actions Bar (mobile)**:
- Clear all button
- Share results button
- View statistics button (if implementing leaderboard)

**Result Sharing**:
- Generate shareable URL with results
- Screenshot functionality for results card
- Copy average to clipboard