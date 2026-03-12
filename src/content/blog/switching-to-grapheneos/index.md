---
createdAt: 2026-03-12T05:59:05.120Z
title: "So, you're thinking of switching to GrapheneOS"
tags:
  - privacy
  - security
  - grapheneos
description: "Bits and pieces that you should know when switching to GrapheneOS"
draft: true
---

(This post doesn't cover everything GrapheneOS can do. Check their website
<https://grapheneos.org/> and ask questions on their forum/discord/matrix if you
need to.)

According to [GrapheneOS](https://grapheneos.org/), it is "a private and secure
mobile operating system with Android app compatibility."

Security, privacy, and convenience exist on a spectrum. GrapheneOS has many
features that will increase your privacy and security, for example storage
scopes, user profiles, and private spaces. Even if you don't use any of the
special security features from GrapheneOS and install Google apps, you still
overall more private and secure than any mainline Android OS.

## Usage

GrapheneOS ships with only _the essentials_. It does ship with an app store that
contains two other app stores (!?), but before you go installing things, it's
important to understand how GrapheneOS handles Google Services Framework/Google
Play Services.

Many apps rely on Google Services Framework (GSF) to provide Google account
auth, notifications (via Firebase Cloud Message), location services, or
contacts/calendar/data sync. If you choose not to install GSF, those features
may not be available. If you do chose to install GSF, GrapheneOS sandboxes it
just like any other app, allowing you to have fine-grained control over its
permissions. Be sure to allow GSF to run unrestricted (regarding battery life)
in the background so it doesn't miss notifications.

Some apps, mainly _some_ banking apps, rely on the
[Play Integrity API](https://developer.android.com/google/play/integrity/overview)
to check if a Phone is trustworthy. GrapheneOS passes the
`MEETS_BASIC_INTEGRITY`, but fails on the `MEETS_DEVICE_INTEGRITY` and
`MEETS_STRONG_INTEGRITY` checks.

There is a
[compatibility database](https://privsec.dev/posts/android/banking-applications-compatibility-with-grapheneos/#international-banking-apps)
that is mostly up-to-date that you can check. I've never had issues with banking
apps themselves, but tap-to-pay doesn't work because Google Wallet requires a
higher Play Integrity API score.

### App Stores

App stores are not just a catalog of apps, they also aim to make it harder to
download malware. That second part is pretty hard, not even Apple's closed
ecosystem is immune
[[1]](https://www.theverge.com/news/606649/ios-iphone-app-store-malicious-apps-malware-crypto-password-screenshot-reader-found)
[[2]](https://www.wired.com/story/apple-app-store-malware-click-fraud/). Google
also tries very hard to not allow malware on the play store, but it still
happens from time to time.

Its not practical to read the code of every app and its dependencies, the OS and
its dependencies, all the compilers and their dependencies, then compile
everything from source just to check that they are all not tampered with. And do
it all again for future updates of everything.
([Plus, how are you going to compile the compiler? With a compiler you don't trust?](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf))

If you want a usable phone, you need to trust someone. I would recommend the
following order of operations when looking for an app. I trust the items lower
on the list less, but they do get more "useful".

GrapheneOS has a built-in app store, but it only has "system apps", including a
few other app stores. I check here first for apps, but there is only like 15
total.

[Accrescent](https://accrescent.app/), available from the GrapheneOS store, is
an app store for open source apps, which aims to fix some of the issues that
F-Droid has (more on that later). Currently, it's still in alpha, and has a much
smaller library compared to Google Play and even F-Droid.

[Obtainium](https://github.com/ImranR98/Obtainium) is an app store that lets you
receive updates directly from the developers, e.g. by downloading an APK from
GitHub releases. If you are worried about installing arbitrary updates from
GitHub, you can use [AppVerifier](https://github.com/soupslurpr/AppVerifier) to
check that the signing key is the same between app versions.
[Side Of Burritos posted a guide on how he uses it.](https://www.youtube.com/watch?v=IkrujqcM-9Y)

The last option is to use Google Play Store with a Google account (which could
be a burner). You can install it from the GrapheneOS app store.

There are other app stores that I would **NOT** recommend using

1. [F-Droid](https://f-droid.org/en/) is an alternative to Accrescent.
   [F-Droid](https://privsec.dev/posts/android/f-droid-security-issues/)
   [has](https://github.com/signalapp/Signal-Android/wiki/F-Droid/4c651dd63c07da221be2bcdb44f8d9878afb2595)
   [received](https://discuss.grapheneos.org/d/20212-f-droid-security-in-simple-words/82)
   [some](https://github.com/signalapp/Signal-Android/issues/127)
   [criticism](https://www.privacyguides.org/en/android/obtaining-apps/#f-droid).
   TLDR; their architecture has some security and usability flaws.

   If you do really want to install apps from the F-Droid app repository, would
   recommend using a different front-end. The original F-Droid app targets an
   outdated Android API version, leading to less fine-grained permission access,
   and it has worse UX compared to alternatives.

   I used to use [Droid-ify](https://droidify.app/)
   ([GitHub repo](https://github.com/Droid-ify/client/)), but there is also
   [Neo Store](https://github.com/NeoApplications/Neo-Store).

1. [Aurora Store](https://auroraoss.com/) is an alternative to the Google Play
   Store. It lets you install apps without a google account. If you use Aurora,
   you are putting your trust in them, on top of Google. There have also been
   times where there service is unavailable, which is inconvenient.

   I would argue that you are trading a too much security for a bit of privacy
   to justify using Aurora Store.

## MISC

If you get good use out of the project, consider donating
<https://grapheneos.org/donate>.

Want to see how Linus from LTT held up after using GrapheneOS for a month?
<https://www.youtube.com/watch?v=gDR6V5OdnYg>
