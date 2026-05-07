# Cha-Tsing — Implementation Spec

## New screen order
onboarding → slider → dreams → insights → coach → feed → (feed is home on return)

## Persistence (localStorage)
- `ct_name` — user's first name
- `ct_income` — gross monthly
- `ct_savings_pct` — savings rate (0–1)
- `ct_savings_log` — JSON array of { id, amount, note, date }
- `ct_allocations` — JSON array of expense bubbles
- On load: if ct_name exists → start on 'feed' screen (returning user)

## 1. Onboarding (src/screens/Onboarding.jsx)
- Step 0: Ask name ("What should I call you?"), single text input, big serif heading
- Step 1: Gross monthly income — free-form number input (keep take-home estimate)
- Fix Chico: smaller size (140px), proper vertical centering, no overflow
- Flat design: no shadows on cards/buttons

## 2. Savings Slider (src/screens/Slider.jsx)
- LOCK to split variant only — remove classic/dial, remove variant prop
- In the split bar: make peso amount directly tappable/editable
  - The savings ₱ amount in the green bar → tap to open inline number input
  - The spending ₱ amount in the amber bar → same
  - Slider still works too
- Flat design: cards use border only, no shadow

## 3. Dreams (src/screens/Dreams.jsx)
- Add custom dream: "+" button at end of horizontal dream picker scroll
  - Opens a bottom sheet: emoji picker (small grid) + name input + target amount input + [Save]
  - Saved custom dreams go into local state array alongside DREAM_LIBRARY
- "Drag to preview future progress" label → change to:
  "How much have you already saved toward this?" with ₱ amount shown as you drag
- Show ₱ amount saved (from the slider value) alongside the % chip

## 4. Coach (src/screens/Coach.jsx)
- In BudgetAdjusterSheet: add "+ Add expense" button that opens BubbleEditSheet in create mode
- The quick replies still work; "Adjust budget" sheet now allows adding new expenses

## 5. Feed Chico — NEW (src/screens/FeedChico.jsx)
- This is the returning-user home screen
- Header: "Good [morning/afternoon/evening], [name]! 🐒" + today's date
- Chico centered (120px), state based on: totalSaved / (monthly * 6) capped at 1, mapped via chicoStateFromSavings
- Speech bubble below Chico with chicoLine
- --- 
- Big card: "Total saved" + ₱ total (animated with useCountTo)
- Progress bar toward selected dream (default: first dream or highest-progress)
- Dream name + months left label
- ---
- Savings log list (scrollable):
  - Each row: date | +₱ amount | note | × remove button
  - Sorted newest first
  - Empty state: "No savings logged yet — tap below to start!"
- ---
- "+ Log savings" primary button → opens AddSavingsSheet
  - Amount: ₱ number input (required)
  - Note: text input (optional, placeholder "e.g. Salary, Bonus, Freelance")
  - Date: defaults to today (input type date)
  - [Save] button adds entry to log
- ---
- Bottom nav row (flat, text links or minimal buttons):
  - "Adjust savings" → navigate to slider
  - "Your dreams" → navigate to dreams
  - "Talk to Chico" → navigate to coach

## 6. Flat Design rules (apply everywhere)
- Remove ALL boxShadow from cards, buttons, sheets
- Buttons: solid fill, no shadow; primary = ink bg + bg text; border-radius 12px
- Cards: background p.bgCard, border `1px solid ${p.line}`, border-radius 14–16px, no shadow
- Dream hero card: remove boxShadow
- BubbleChipBody: remove boxShadow  
- Sheet overlays (BubbleEditSheet, BudgetAdjusterSheet): no box-shadow on sheet itself
- FatSlider handle: no boxShadow
- Chico speech bubble: no shadow
- Consistent padding: 16–20px for screen edges, 14px for card inner padding

## 7. App.jsx
- Add state: name, savingsLog
- localStorage init for all persisted state
- Navigate to 'feed' on return (name already set)
- Expose addSavingsEntry / removeSavingsEntry / setName
- Pass name + savingsLog + dream state to FeedChico
