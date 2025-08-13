# Advisor Interactions Feature Tests

## Test Scenarios

### 1. End-to-End Advisor Creation with Categorization

**Test Case**: Create new advisor as Board Advisor
- Navigate to admin panel
- Click "Add Advisor"
- Fill in advisor details
- Leave "Add as Interaction" checkbox unchecked
- Submit form
- Verify advisor appears in Board of Advisors section on public page
- Verify advisor shows "Board Advisor" badge in admin list

**Test Case**: Create new advisor as Interaction
- Navigate to admin panel
- Click "Add Advisor"
- Fill in advisor details
- Check "Add as Interaction" checkbox
- Submit form
- Verify advisor appears in Interactions section on public page
- Verify advisor shows "Interaction" badge in admin list

### 2. Page Rendering with Both Section Types

**Test Case**: Display both sections when data exists
- Ensure database has both board advisors and interactions
- Navigate to Board of Advisors page
- Verify "Board of Advisors" section displays with correct advisors
- Verify "Interactions" section displays below with correct advisors
- Verify both sections use identical card styling

**Test Case**: Hide empty sections
- Remove all interaction advisors from database
- Navigate to Board of Advisors page
- Verify "Board of Advisors" section displays
- Verify "Interactions" section is not rendered

### 3. Admin Workflow for Changing Advisor Categorization

**Test Case**: Change Board Advisor to Interaction
- Navigate to admin panel
- Find a board advisor in the list
- Click edit button
- Check "Add as Interaction" checkbox
- Save changes
- Verify advisor moves from Board of Advisors to Interactions section
- Verify badge changes in admin list

**Test Case**: Change Interaction to Board Advisor
- Navigate to admin panel
- Find an interaction in the list
- Click edit button
- Uncheck "Add as Interaction" checkbox
- Save changes
- Verify advisor moves from Interactions to Board of Advisors section
- Verify badge changes in admin list

### 4. Admin Filtering Functionality

**Test Case**: Filter by Board Advisors
- Navigate to admin panel advisors section
- Click "Board Advisors" filter button
- Verify only advisors with "Board Advisor" badges are shown
- Verify button appears active

**Test Case**: Filter by Interactions
- Navigate to admin panel advisors section
- Click "Interactions" filter button
- Verify only advisors with "Interaction" badges are shown
- Verify button appears active

**Test Case**: Show all advisors
- Navigate to admin panel advisors section
- Click "All" filter button
- Verify all advisors are shown regardless of type
- Verify button appears active

### 5. Responsive Design Testing

**Test Case**: Mobile layout
- Navigate to Board of Advisors page on mobile device
- Verify both sections display properly in mobile layout
- Verify cards stack appropriately
- Verify text remains readable

**Test Case**: Tablet layout
- Navigate to Board of Advisors page on tablet device
- Verify grid layout adjusts appropriately
- Verify spacing between sections is maintained

**Test Case**: Desktop layout
- Navigate to Board of Advisors page on desktop
- Verify full grid layout displays properly
- Verify hover effects work on both section types

### 6. API Integration Testing

**Test Case**: Fetch board advisors only
- Make API call to `/api/admin/advisors?type=board`
- Verify response contains only advisors with `isInteraction: false`

**Test Case**: Fetch interactions only
- Make API call to `/api/admin/advisors?type=interaction`
- Verify response contains only advisors with `isInteraction: true`

**Test Case**: Fetch all advisors
- Make API call to `/api/admin/advisors`
- Verify response contains all advisors regardless of type

### 7. Database Migration Testing

**Test Case**: Migration of existing advisors
- Run migration script on database with existing advisors
- Verify all existing advisors have `isInteraction: false`
- Verify no data is lost during migration

**Test Case**: Seed data creation
- Run seed script on empty database
- Verify sample interaction advisors are created
- Verify sample advisors have `isInteraction: true`

## Manual Testing Checklist

- [ ] Admin can create board advisors (checkbox unchecked)
- [ ] Admin can create interactions (checkbox checked)
- [ ] Admin can edit advisor categorization
- [ ] Admin list shows correct badges for each type
- [ ] Admin filtering works for all three options (All, Board, Interactions)
- [ ] Public page shows Board of Advisors section
- [ ] Public page shows Interactions section when data exists
- [ ] Public page hides Interactions section when no data
- [ ] Both sections use identical card styling
- [ ] Responsive design works on all screen sizes
- [ ] Loading states display correctly for each section
- [ ] Error states display correctly for each section
- [ ] Text blocks can be customized for both sections
- [ ] Database migration runs without errors
- [ ] Seed data creates sample interactions correctly

## Performance Testing

- [ ] Page loads within 3 seconds with multiple advisors
- [ ] Admin filtering responds immediately
- [ ] Image loading is optimized
- [ ] No unnecessary re-renders occur when switching filters
- [ ] Database queries are efficient with proper indexing