# Image slots

Every picture on the site is a **file in this folder with a fixed name**. Right now they are all copies of the
two sample photos (`couples-sample1.jpg`, `couples-sample2.jpg`) so the layout can be judged.

## How to put in the real photos

1. Take your real photo, resize it roughly to the size in the table (bigger is fine, smaller looks soft).
2. **Rename it to the exact file name** from the table (keep `.jpg`).
3. Drop it into this folder, overwriting the placeholder.
4. If the old picture still shows, stop and restart `npm run dev` (Next.js caches resized images).

You do not need to edit any code. The names are wired up in `lib/config/images.ts`.

Photos are cropped to fit each shape, so keep faces away from the very edges. If a head gets cut off, change the
`position` (e.g. `'50% 15%'` = look higher up the photo) for that slot in `lib/config/images.ts`.

Tip: save JPGs at quality 80 to 85. Whole folder under about 15 MB keeps the site fast on mobile data.

| File name | Where it appears | Recommended size | Shape |
| --- | --- | --- | --- |
| `hero-slide-1.jpg` | Home hero: full-screen slideshow, photo 1 of 3 | 1920 x 1080 | landscape |
| `hero-slide-2.jpg` | Home hero: full-screen slideshow, photo 2 of 3 | 1920 x 1080 | landscape |
| `hero-slide-3.jpg` | Home hero: full-screen slideshow, photo 3 of 3 | 1920 x 1080 | landscape |
| `hero-arch-portrait.jpg` | Home hero: floating arch portrait (right side, desktop) | 1200 x 1600 | portrait 3:4 |
| `journey-portrait-couple.jpg` | Our Journey: arch portrait, left (the couple) | 1200 x 1700 | portrait |
| `journey-portrait-groom.jpg` | Our Journey: arch portrait, middle (Godswill) | 1200 x 1700 | portrait |
| `journey-portrait-bride.jpg` | Our Journey: arch portrait, right (Blessing) | 1200 x 1700 | portrait |
| `journey-gallery-01.jpg` | Our Journey: gliding photo gallery, top row (photo 1 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-02.jpg` | Our Journey: gliding photo gallery, top row (photo 2 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-03.jpg` | Our Journey: gliding photo gallery, top row (photo 3 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-04.jpg` | Our Journey: gliding photo gallery, top row (photo 4 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-05.jpg` | Our Journey: gliding photo gallery, top row (photo 5 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-06.jpg` | Our Journey: gliding photo gallery, top row (photo 6 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-07.jpg` | Our Journey: gliding photo gallery, top row (photo 7 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-08.jpg` | Our Journey: gliding photo gallery, top row (photo 8 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-09.jpg` | Our Journey: gliding photo gallery, bottom row (photo 9 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-10.jpg` | Our Journey: gliding photo gallery, bottom row (photo 10 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-11.jpg` | Our Journey: gliding photo gallery, bottom row (photo 11 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-12.jpg` | Our Journey: gliding photo gallery, bottom row (photo 12 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-13.jpg` | Our Journey: gliding photo gallery, bottom row (photo 13 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-14.jpg` | Our Journey: gliding photo gallery, bottom row (photo 14 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-15.jpg` | Our Journey: gliding photo gallery, bottom row (photo 15 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `journey-gallery-16.jpg` | Our Journey: gliding photo gallery, bottom row (photo 16 of 16) | 1000 x 1300 | portrait or square (cropped to fit) |
| `band-1-quote.jpg` | Full-width scrolling photo band after Our Journey ("Love, belief...") | 1920 x 1080 | landscape |
| `band-2-savethedate.jpg` | Full-width scrolling photo band before the FAQs ("Save the date") | 1920 x 1080 | landscape |
| `band-3-cta.jpg` | Full-width scrolling photo band above the footer (Register call to action) | 1920 x 1080 | landscape |
| `wedding-venue.jpg` | The Wedding: venue card header | 1200 x 900 | landscape 4:3 |
| `wedding-transport.jpg` | The Wedding: transportation card header (a real bus photo is ideal) | 1200 x 900 | landscape 4:3 |
| `wedding-attire.jpg` | The Wedding: attire card header | 1200 x 900 | landscape 4:3 |
| `attire-inspo-1.jpg` | The Wedding: attire colour inspiration, photo 1 of 4 | 900 x 1200 | portrait 3:4 |
| `attire-inspo-2.jpg` | The Wedding: attire colour inspiration, photo 2 of 4 | 900 x 1200 | portrait 3:4 |
| `attire-inspo-3.jpg` | The Wedding: attire colour inspiration, photo 3 of 4 | 900 x 1200 | portrait 3:4 |
| `attire-inspo-4.jpg` | The Wedding: attire colour inspiration, photo 4 of 4 | 900 x 1200 | portrait 3:4 |
| `bg-takeoff.jpg` | Takeoff Points section background (dark overlay on top) | 1920 x 1080 | landscape |
| `bg-schedule.jpg` | Schedule section background (very faint) | 1920 x 1080 | landscape |
| `bg-faq.jpg` | FAQs section background (dark overlay on top) | 1920 x 1080 | landscape |
| `bg-footer.jpg` | Footer background (dark overlay on top) | 1920 x 1080 | landscape |
| `page-photos-header.jpg` | Event Photos page: banner at the top | 1920 x 800 | wide landscape |
| `page-register-side.jpg` | Register page: side picture (desktop) | 900 x 1300 | portrait |
| `page-login-side.jpg` | Log in and Reset password pages: side picture (desktop) | 900 x 1300 | portrait |

Total: 40 images.
