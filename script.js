 const STORAGE_KEY = "sengolShoppingProducts";

/* =========================
   SOCIAL LINKS
========================= */

const SOCIALS = [
    [
        "Instagram",
        "https://www.instagram.com/sengol_fashion?igsh=MXJmdmk3cWx1MWkwdQ=="
    ],
    [
        "Pinterest",
        "https://pin.it/1gLdGoSRR"
    ],
    [
        "Facebook",
        "https://www.facebook.com/profile.php?id=61593100736281&mibextid=ZbWKwL"
    ],
    [
        "WhatsApp Channel",
        "https://whatsapp.com/channel/0029VbCpLAEJpe8ds88N1m08"
    ],
    [
        "YouTube",
        "https://youtube.com/@sengolgroup?si=4YkCgFKl-msRLu_3"
    ],
    [
        "X / Twitter",
        "https://x.com/sengolaffiliate"
    ],
    [
        "Telegram",
        "#"
    ]
];

/* =========================
   SHOPPING PLATFORMS
========================= */

const PLATFORMS = [
    [
        "Amazon",
        "#",
        "https://www.amazon.in/"
    ],
    [
        "Flipkart",
        "#",
        "https://www.flipkart.com/"
    ],
    [
        "Meesho",
        "#",
        "https://www.meesho.com/"
    ],
    [
        "Myntra",
        "#",
        "https://www.myntra.com/"
    ],
    [
        "AJIO",
        "#",
        "https://www.ajio.com/"
    ],
    [
        "Tata CLiQ",
        "#",
        "https://www.tatacliq.com/"
    ],
    [
        "Shopsy",
        "#",
        "https://www.shopsy.in/"
    ]
];

/* =========================
   HELPERS
========================= */

function products() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];
    } catch (e) {
        return [];
    }
}

function esc(value) {
    return String(value || "").replace(
        /[&<>"']/g,
        function (m) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[m];
        }
    );
}

/* =========================
   WELCOME SCREEN
========================= */

function initWelcome() {
    const welcome =
        document.getElementById("welcome-screen");

    const button =
        document.getElementById("enter-site");

    if (!welcome) return;

    if (button) {
        button.addEventListener("click", function () {
            welcome.classList.add("hide");
        });
    }

    setTimeout(function () {
        welcome.classList.add("hide");
    }, 7000);
}

/* =========================
   MOBILE MENU
========================= */

function initMenu() {
    const button =
        document.getElementById("menu-btn");

    const menu =
        document.getElementById("main-menu");

    if (!button || !menu) return;

    button.addEventListener("click", function () {
        menu.classList.toggle("menu-open");

        button.setAttribute(
            "aria-expanded",
            menu.classList.contains("menu-open")
        );
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("menu-open");

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}

/* =========================
   PLATFORM GRID
========================= */

function renderPlatforms() {
    const grid =
        document.getElementById("platform-grid");

    if (!grid) return;

    grid.innerHTML = PLATFORMS.map(
        function (platform, index) {
            return `
                <button
                    class="platform-card"
                    data-platform="${index}"
                    type="button"
                >
                    <div class="platform-logo">
                        ${esc(platform[0])}
                    </div>

                    <span>
                        Explore →
                    </span>
                </button>
            `;
        }
    ).join("");

    grid
        .querySelectorAll("[data-platform]")
        .forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    openPlatform(
                        Number(button.dataset.platform)
                    );
                }
            );
        });
}

/* =========================
   PLATFORM MODAL
========================= */

function openPlatform(index) {
    const platform = PLATFORMS[index];

    if (!platform) return;

    const modal =
        document.getElementById("platform-modal");

    const actions =
        document.getElementById("platform-actions");

    const title =
        document.getElementById("platform-title");

    if (!modal || !actions || !title) return;

    title.textContent = platform[0];

    const affiliateUrl = platform[1];
    const directUrl = platform[2];

    let affiliateButton = "";

    if (
        affiliateUrl &&
        affiliateUrl !== "#"
    ) {
        affiliateButton = `
            <a
                class="btn primary"
                href="${esc(affiliateUrl)}"
                target="_blank"
                rel="noopener noreferrer nofollow"
            >
                🔗 Shop with Sengol Affiliate
            </a>
        `;
    } else {
        affiliateButton = `
            <div class="notice">
                Affiliate route for
                ${esc(platform[0])}
                is not connected yet.
            </div>
        `;
    }

    actions.innerHTML = `
        ${affiliateButton}

        <a
            class="btn secondary"
            href="${esc(directUrl)}"
            target="_blank"
            rel="noopener noreferrer"
        >
            🏪 Visit ${esc(platform[0])} Directly
        </a>
    `;

    modal.hidden = false;
}

/* =========================
   PRODUCT TYPE
========================= */

function getProductType(type) {
    if (type === "sengol") {
        return {
            label: "🛍️ Sengol Product",
            button: "Buy Sengol Product →"
        };
    }

    if (type === "affiliate") {
        return {
            label: "🔗 Affiliate Product",
            button: "Shop via Sengol →"
        };
    }

    if (type === "marketplace") {
        return {
            label: "🏪 Marketplace Product",
            button: "Visit Store →"
        };
    }

    return {
        label: "Product",
        button: "Shop Now →"
    };
}

/* =========================
   PRODUCT URL
========================= */

function getProductURL(product) {
    if (product.productType === "sengol") {
        return (
            product.directLink ||
            product.affiliateLink ||
            "#"
        );
    }

    if (product.productType === "affiliate") {
        return (
            product.affiliateLink ||
            product.directLink ||
            "#"
        );
    }

    if (product.productType === "marketplace") {
        return (
            product.directLink ||
            product.affiliateLink ||
            "#"
        );
    }

    return (
        product.affiliateLink ||
        product.directLink ||
        "#"
    );
}

/* =========================
   PRODUCT RENDER
========================= */

function renderProducts() {
    const grid =
        document.getElementById("product-grid");

    const empty =
        document.getElementById("empty-products");

    const searchInput =
        document.getElementById("product-search");

    const categoryInput =
        document.getElementById("category-filter");

    if (!grid) return;

    const search =
        (
            searchInput
                ? searchInput.value
                : ""
        ).toLowerCase();

    const category =
        categoryInput
            ? categoryInput.value
            : "all";

    const list = products().filter(
        function (product) {
            const name =
                (product.name || "").toLowerCase();

            const description =
                (product.description || "")
                    .toLowerCase();

            const matchesCategory =
                category === "all" ||
                product.category === category;

            const matchesSearch =
                !search ||
                name.includes(search) ||
                description.includes(search);

            return (
                matchesCategory &&
                matchesSearch
            );
        }
    );

    grid.innerHTML = list.map(
        function (product) {
            const type =
                getProductType(
                    product.productType
                );

            const purchaseURL =
                getProductURL(product);

            return `
                <article class="product-card">

                    <div class="product-image">
                        ${
                            product.image
                                ? `
                                    <img
                                        src="${esc(product.image)}"
                                        alt="${esc(product.name)}"
                                        loading="lazy"
                                    >
                                  `
                                : `
                                    <div
                                        style="
                                            height:100%;
                                            display:grid;
                                            place-items:center;
                                            font-weight:800;
                                            color:#777;
                                        "
                                    >
                                        SENGOL
                                    </div>
                                  `
                        }
                    </div>

                    <p class="product-category">
                        ${esc(product.category)}
                    </p>

                    <p>
                        <strong>
                            ${esc(type.label)}
                        </strong>
                    </p>

                    <h3>
                        ${esc(product.name)}
                    </h3>

                    <p>
                        ${esc(product.description)}
                    </p>

                    ${
                        product.price
                            ? `
                                <p class="product-price">
                                    ₹${esc(product.price)}
                                </p>
                              `
                            : ""
                    }

                    <p class="product-rating">
                        ⭐ ${esc(product.rating || "5")} / 5
                    </p>

                    ${
                        product.discount
                            ? `
                                <p>
                                    🔥 ${esc(product.discount)}
                                </p>
                              `
                            : ""
                    }

                    ${
                        product.trending
                            ? `
                                <p>
                                    🔥 Trending
                                </p>
                              `
                            : ""
                    }

                    ${
                        product.featured
                            ? `
                                <p>
                                    ⭐ Featured
                                </p>
                              `
                            : ""
                    }

                    ${
                        purchaseURL !== "#"
                            ? `
                                <a
                                    class="btn primary"
                                    href="${esc(purchaseURL)}"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                >
                                    ${esc(type.button)}
                                </a>
                              `
                            : `
                                <button
                                    class="btn primary"
                                    type="button"
                                    disabled
                                >
                                    Link Coming Soon
                                </button>
                              `
                    }

                    ${
                        product.productType === "affiliate" &&
                        product.directLink
                            ? `
                                <a
                                    class="btn secondary"
                                    href="${esc(product.directLink)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Official Site
                                </a>
                              `
                            : ""
                    }

                    ${
                        product.productType === "sengol" &&
                        product.directLink
                            ? `
                                <a
                                    class="btn secondary"
                                    href="${esc(product.directLink)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    More Details
                                </a>
                              `
                            : ""
                    }

                </article>
            `;
        }
    ).join("");

    if (empty) {
        empty.hidden = list.length !== 0;
    }
}

/* =========================
   SOCIAL LINKS
========================= */

function renderSocials() {
    const grid =
        document.getElementById("social-grid");

    if (!grid) return;

    grid.innerHTML = SOCIALS.map(
        function (social) {
            const disabled =
                !social[1] ||
                social[1] === "#";

            if (disabled) {
                return `
                    <div
                        class="social-card"
                        style="opacity:.5"
                    >
                        ${esc(social[0])}
                        <small>
                            Coming Soon
                        </small>
                    </div>
                `;
            }

            return `
                <a
                    class="social-card"
                    href="${esc(social[1])}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${esc(social[0])} →
                </a>
            `;
        }
    ).join("");
}

/* =========================
   LOGIN / ACCOUNT
========================= */

function initAuth() {
    const modal =
        document.getElementById("auth-modal");

    const login =
        document.getElementById("login-btn");

    const form =
        document.getElementById("auth-form");

    const toggle =
        document.getElementById("toggle-auth");

    const logout =
        document.getElementById("logout-btn");

    const title =
        document.getElementById("auth-title");

    const name =
        document.getElementById("auth-name");

    if (
        !modal ||
        !login ||
        !form ||
        !toggle ||
        !logout
    ) {
        return;
    }

    let signup = false;

    function refresh() {
        let user = null;

        try {
            user = JSON.parse(
                localStorage.getItem(
                    "sengolUser"
                ) || "null"
            );
        } catch (e) {
            user = null;
        }

        login.textContent =
            user
                ? `Hi, ${user.name}`
                : "Login";

        logout.hidden = !user;
        form.hidden = !!user;
        toggle.hidden = !!user;

        if (name) {
            name.required = signup;
        }
    }

    refresh();

    login.addEventListener(
        "click",
        function () {
            modal.hidden = false;
        }
    );

    toggle.addEventListener(
        "click",
        function () {
            signup = !signup;

            title.textContent =
                signup
                    ? "Create account"
                    : "Login";

            toggle.textContent =
                signup
                    ? "Already have an account? Login"
                    : "Create account";

            if (name) {
                name.required = signup;
            }
        }
    );

    form.addEventListener(
        "submit",
        function (e) {
            e.preventDefault();

            const email =
                document.getElementById(
                    "auth-email"
                );

            const password =
                document.getElementById(
                    "auth-password"
                );

            const user = {
                name:
                    name.value.trim() ||
                    "Customer",

                email:
                    email
                        ? email.value.trim()
                        : "",

                password:
                    password
                        ? password.value
                        : ""
            };

            localStorage.setItem(
                "sengolUser",
                JSON.stringify(user)
            );

            alert(
                "Account saved on this device."
            );

            modal.hidden = true;

            refresh();
        }
    );

    logout.addEventListener(
        "click",
        function () {
            localStorage.removeItem(
                "sengolUser"
            );

            refresh();
        }
    );
}

/* =========================
   AFFILIATE CENTER
========================= */

function initAffiliate() {
    const button =
        document.getElementById(
            "generate-affiliate"
        );

    const input =
        document.getElementById(
            "affiliate-source"
        );

    const result =
        document.getElementById(
            "affiliate-result"
        );

    if (!button || !input || !result) {
        return;
    }

    button.addEventListener(
        "click",
        function () {
            const url =
                input.value.trim();

            if (!url) {
                result.textContent =
                    "Paste an authorized affiliate URL first.";

                return;
            }

            try {
                new URL(url);

                result.innerHTML = `
                    <p>
                        Authorized URL prepared:
                    </p>

                    <input
                        value="${esc(url)}"
                        readonly
                    >

                    <button
                        class="btn primary"
                        id="copy-affiliate"
                        type="button"
                    >
                        Copy Link
                    </button>
                `;

                const copy =
                    document.getElementById(
                        "copy-affiliate"
                    );

                if (copy) {
                    copy.addEventListener(
                        "click",
                        function () {
                            if (
                                navigator.clipboard &&
                             
