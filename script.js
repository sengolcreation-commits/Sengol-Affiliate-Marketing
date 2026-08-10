 const KEY = "sengolShoppingProducts";
const SITE_RATING_KEY = "sengolSiteRatings";

let editId = null;

const $ = id => document.getElementById(id);

function get() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
        return [];
    }
}

function save(x) {
    localStorage.setItem(KEY, JSON.stringify(x));
}

function esc(v) {
    return String(v || "").replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}

/* =========================
   RESET FORM
========================= */

function reset() {
    editId = null;

    $("productForm").reset();

    if ($("productRating")) {
        $("productRating").value = "5";
    }

    $("submitBtn").textContent = "Add Product";
}

/* =========================
   RENDER PRODUCTS
========================= */

function render() {

    const searchBox = $("searchProducts");

    const q = searchBox
        ? (searchBox.value || "").toLowerCase()
        : "";

    const list = get().filter(p =>
        (p.name || "").toLowerCase().includes(q)
    );

    $("productList").innerHTML =
        list.map(p => `

        <div class="panel" style="margin:15px 0">

            <h3>${esc(p.name)}</h3>

            <p>
                ${esc(p.category)}
                ${p.price ? ` • ₹${esc(p.price)}` : ""}
            </p>

            <p>
                ${esc(p.description)}
            </p>

            <p>
                Product Rating:
                ⭐ ${esc(p.rating || "5")}/5
            </p>

            ${
                p.discount
                    ? `<p>Discount: ${esc(p.discount)}%</p>`
                    : ""
            }

            ${
                p.trending
                    ? `<p>Trending Product</p>`
                    : ""
            }

            ${
                p.featured
                    ? `<p>Featured Product</p>`
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

    `).join("") || "<div class='empty'>No products.</div>";
}

/* =========================
   EDIT PRODUCT
========================= */

function edit(id) {

    const p = get().find(x => x.id === id);

    if (!p) return;

    editId = id;

    $("productName").value = p.name || "";
    $("productCategory").value = p.category || "";
    $("productPrice").value = p.price || "";
    $("productDiscount").value = p.discount || "";
    $("productImage").value = p.image || "";
    $("productDescription").value = p.description || "";
    $("affiliateLink").value = p.affiliateLink || "";

    if ($("productRating")) {
        $("productRating").value = p.rating || "5";
    }

    $("isTrending").checked = !!p.trending;
    $("isFeatured").checked = !!p.featured;

    $("submitBtn").textContent = "Update Product";

    scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================
   DELETE PRODUCT
========================= */

function del(id) {

    if (!confirm("Delete this product?")) {
        return;
    }

    save(
        get().filter(p => p.id !== id)
    );

    render();
}

/* =========================
   ADD / UPDATE PRODUCT
========================= */

$("productForm").addEventListener("submit", e => {

    e.preventDefault();

    const p = {

        id: editId || Date.now().toString(),

        name: $("productName").value.trim(),

        category: $("productCategory").value,

        price: $("productPrice").value.trim(),

        discount: $("productDiscount").value.trim(),

        image: $("productImage").value.trim(),

        description:
            $("productDescription").value.trim(),

        affiliateLink:
            $("affiliateLink").value.trim(),

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
        !p.description ||
        !p.affiliateLink
    ) {

        alert("Fill all required fields.");

        return;
    }

    const a = get();

    const i = a.findIndex(
        x => x.id === p.id
    );

    if (i >= 0) {
        a[i] = p;
    } else {
        a.unshift(p);
    }

    save(a);

    reset();

    render();

    alert(
        editId
            ? "Product updated successfully."
            : "Product added successfully."
    );
});

/* =========================
   CLEAR BUTTON
========================= */

if ($("clearBtn")) {

    $("clearBtn").onclick = reset;

}

/* =========================
   PRODUCT SEARCH
========================= */

if ($("searchProducts")) {

    $("searchProducts").oninput = render;

}

/* =========================
   SITE RATING
========================= */

function getSiteRatings() {

    try {

        return JSON.parse(
            localStorage.getItem(SITE_RATING_KEY)
        ) || [];

    } catch (e) {

        return [];

    }
}

function saveSiteRating(rating) {

    const ratings = getSiteRatings();

    ratings.push({
        rating: Number(rating),
        date: new Date().toISOString()
    });

    localStorage.setItem(
        SITE_RATING_KEY,
        JSON.stringify(ratings)
    );

}

/* =========================
   SITE RATING DISPLAY
========================= */

function renderSiteRating() {

    const ratings = getSiteRatings();

    const total = ratings.length;

    const average =
        total > 0
            ? ratings.reduce(
                (sum, item) =>
                    sum + Number(item.rating),
                0
            ) / total
            : 0;

    const averageRounded =
        total > 0
            ? average.toFixed(1)
            : "0.0";

    const adminRating =
        $("siteRatingAverage");

    const adminCount =
        $("siteRatingCount");

    if (adminRating) {

        adminRating.textContent =
            `⭐ ${averageRounded}/5`;

    }

    if (adminCount) {

        adminCount.textContent =
            `${total} rating${total === 1 ? "" : "s"}`;

    }

}

/* =========================
   SITE RATING FORM
========================= */

const siteRatingForm =
    $("siteRatingForm");

if (siteRatingForm) {

    siteRatingForm.addEventListener(
        "submit",
        e => {

            e.preventDefault();

            const selected =
                document.querySelector(
                    'input[name="siteRating"]:checked'
                );

            if (!selected) {

                alert(
                    "Please select a rating."
                );

                return;
            }

            saveSiteRating(
                selected.value
            );

            alert(
                "Thank you for rating Sengol!"
            );

            siteRatingForm.reset();

            renderSiteRating();

        }
    );

}

/* =========================
   START
========================= */

render();

renderSiteRating();
