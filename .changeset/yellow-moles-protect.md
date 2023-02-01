---
'@spruceid/ssx-gnosis-extension': patch
---

`ssx-gnosis-extension` helps to enable the DAO Login functionality by creating a modal and enabling selectors for end users. Because the module fetches the list of delegates for the sole purpose of displaying a selection UX to the user, the selected option is not currently matched against the retrieved list of delegates. This important security check is performed in SSX Server via a call to SiweMessage.verify, and these modules were designed to work together. This change improves the experience for developers who want to use `ssx-gnosis-extension` standalone (that is, without SSX Server) by adding extra checks on the client side to help with UX. However, the server side MUST still check for delegate inclusion by using SiweMessage.verify or similar immediately after sign-in.
