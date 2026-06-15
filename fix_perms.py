import sqlite3

db = sqlite3.connect("./data.db")
c = db.cursor()

actions = [
    "api::product.product.find",
    "api::product.product.findOne",
    "api::category.category.find",
    "api::category.category.findOne",
    "api::order.order.create",
    "api::wishlist.wishlist.find",
    "plugin::users-permissions.auth.login",
]

now = "2026-06-15T19:00:00.000Z"

for action in actions:
    c.execute("SELECT id FROM up_permissions WHERE action=?", (action,))
    row = c.fetchone()
    if row:
        perm_id = row[0]
        c.execute("SELECT id FROM up_permissions_role_lnk WHERE permission_id=? AND role_id=?", (perm_id, 2))
        if not c.fetchone():
            c.execute("INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)", (perm_id, 2))
            print(f"Linked: {action}")
    else:
        c.execute("INSERT INTO up_permissions (action, created_at, updated_at, published_at) VALUES (?, ?, ?, ?)",
                  (action, now, now, now))
        perm_id = c.lastrowid
        c.execute("INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1)", (perm_id, 2))
        print(f"Created+linked: {action}")

db.commit()
db.close()
print("Done")
