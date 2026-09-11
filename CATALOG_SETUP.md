# Strawbelle Catalog & Inventory

The project ships with the original 50-product catalog plus the 13 products from `strawbelle_handbags_catalog_2026-08-25.json` (63 products total).

## Add inventory from the website
1. Open the Admin dashboard.
2. Open the Catalog / Initial Data panel.
3. Choose **Import JSON**.
4. Select your catalog JSON file.
5. Choose **Append / Merge** to keep existing products and add/update imported products.
6. Choose **Replace** only when you intentionally want to replace the entire catalog.

## Add one handbag manually
Use **Add New Handbag to Catalog**, fill in the product fields, upload/paste its image data, set stock and status, then save.

Imported inventory is persisted in the browser via the existing store persistence. The bundled JSON is also available at `public/catalog/strawbelle_handbags_catalog_2026-08-25.json`.

## Admin access

The public storefront does not show an Admin link. Open the site with `?admin=1` to reach the admin sign-in screen.

The current package includes a client-side password gate for casual/private administration. This is **not a substitute for server-side authentication** because this project stores catalog edits in browser storage. For true production security and shared inventory across all customers, connect the catalog to a server/database with authenticated admin APIs.


## Catalog workflow

The public website no longer includes an Admin Dashboard or admin URL. Catalog changes are made in the catalog JSON and then merged into the website build before deployment.

For a new handbag, provide the updated catalog JSON and the website ZIP can be regenerated with the new inventory included. Customers cannot access catalog-management controls from the storefront.
