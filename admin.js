 const KEY = "sengolShoppingProducts";

let editId = null;

const $ = id => document.getElementById(id);

function get() {
    try {
        return JSON.parse(
            localStorage.getItem(KEY)
        ) || [];
    } catch (e) {
        return [];
    }
}

function save(x) {
    localStorage.setItem(
        KEY,
        JSON.stringify(x)
    );
}

function esc(v) {
    return String(v || "").replace(
        /[&<>"']/g,
        m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[m])
    );
}


/* =========================
   RESET
========================= */

function reset() {

    editId = null;

    $("productForm").reset();

    if ($("productRating")) {
        $("productRating").value = "5";
    }

    if ($("productType")) {
        $("productType").value = "";
    }

    $("submitBtn").textContent =
        "Add Product";
}


/* =========================
   RENDER
========================= */

function render() {

    const q =
        (
            $("searchProducts")?.value || ""
        ).toLowerCase();

    const list =
        get().filter(
            p =>
                (p.name || "")
                    .toLowerCase()
                    .includes(q)
        );

    $("productList").innerHTML =

        list.map(
            p => `

            <div
                class="panel"
                style="margin:15px 0">

                <h3>
                    ${esc(p.name)}
                </h3>

                <p>
                    ${esc(p.category)}
                    ${
                        p.price
                            ? ` • ₹${esc(p.price)}`
                            : ""
                    }
                </p>

                <p>
                    Product Type:
                    <strong>
                        ${
                            p.productType === "sengol"
                                ? "Sengol Product"
                                : p.productType === "affiliate"
                                    ? "Affiliate Product"
                                    : "Marketplace Product"
                        }
                    </strong>
                </p>

                <p>
                    ${esc(p.description)}
                </p>

                <p>
                    ⭐ ${esc(p.rating || "5")}/5
                </p>

                ${
                    p.discount
                        ? `
                        <p>
                            Discount:
                            ${esc(p.discount)}
                        </p>
                        `
                        : ""
                }

                ${
                    p.trending
                        ? `<p>🔥 Trending Product</p>`
                        : ""
                }

                ${
                    p.featured
                        ? `<p>⭐ Featured Product</p>`
                        : ""
                }

                <div class="actions">

                    <button
                        class="btn secondary"
                        onclick="edit('${p.id}')">

                        Edit

                    </button>

                    <button
                        class="btn primary"
                        onclick="del('${p.id}')">

                        Delete

                    </button>

                </div>

            </div>

            `
        ).join("")

        || "<div class='empty'>No products.</div>";
}


/* =========================
   EDIT
========================= */

function edit(id) {

    const p =
        get().find(
            x => x.id === id
        );

    if (!p) return;

    editId = id;

    $("productName").value =
        p.name || "";

    $("productCategory").value =
        p.category || "";

    $("productType").value =
        p.productType || "";

    $("productPrice").value =
        p.price || "";

    $("productDiscount").value =
        p.discount || "";

    $("productImage").value =
        p.image || "";

    $("productDescription").value =
        p.description || "";

    $("affiliateLink").value =
        p.affiliateLink || "";

    if ($("productRating")) {
        $("productRating").value =
            p.rating || "5";
    }

    $("isTrending").checked =
        !!p.trending;

    $("isFeatured").checked =
        !!p.featured;

    $("submitBtn").textContent =
        "Update Product";

    scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   DELETE
========================= */

function del(id) {

    if (
        !confirm(
            "Delete this product?"
        )
    ) {
        return;
    }

    save(
        get().filter(
            p => p.id !== id
        )
    );

    render();
}


/* =========================
   ADD / UPDATE
========================= */

$("productForm").addEventListener(
    "submit",
    e => {

        e.preventDefault();

        const p = {

            id:
                editId ||
                Date.now().toString(),

            name:
                $("productName")
                    .value
                    .trim(),

            category:
                $("productCategory")
                    .value,

            productType:
                $("productType")
                    ? $("productType").value
                    : "marketplace",

            price:
                $("productPrice")
                    .value
                    .trim(),

            discount:
                $("productDiscount")
                    .value
                    .trim(),

            image:
                $("productImage")
                    .value
                    .trim(),

            description:
                $("productDescription")
                    .value
                    .trim(),

            affiliateLink:
                $("affiliateLink")
                    .value
                    .trim(),

            rating:
                $("productRating")
                    ? $("productRating").value
                    : "5",

            trending:
                $("isTrending").checked,

            featured:
                $("isFeatured").checked
        };


        if (
            !p.name ||
            !p.category ||
            !p.productType ||
            !p.description ||
            !p.affiliateLink
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        const a = get();

        const i =
            a.findIndex(
                x => x.id === p.id
            );


        if (i >= 0) {

            a[i] = p;

        } else {

            a.unshift(p);

        }


        save(a);

        const wasEditing =
            !!editId;

        reset();

        render();

        alert(
            wasEditing
                ? "Product updated successfully."
                : "Product added successfully."
        );

    }
);


/* =========================
   CLEAR
========================= */

if ($("clearBtn")) {

    $("clearBtn").onclick =
        reset;

}


/* =========================
   SEARCH
========================= */

if ($("searchProducts")) {

    $("searchProducts").oninput =
        render;

}


/* =========================
   START
========================= */

render();
