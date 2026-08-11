 const STORAGE_KEY = "sengolShoppingProducts";

const SOCIALS = [
  ["Instagram","https://www.instagram.com/sengol_fashion/"],
  ["Pinterest","https://pin.it/1gLdGoSRR"],
  ["Facebook","https://www.facebook.com/profile.php?id=61593100736281"],
  ["WhatsApp Channel","https://whatsapp.com/channel/0029VbCpLAEJpe8ds88N1m08"],
  ["YouTube","https://youtube.com/@sengolgroup"],
  ["X / Twitter","https://x.com/sengolaffiliate"]
];

const PLATFORMS = [
  ["Amazon","https://www.amazon.in/"],
  ["Flipkart","https://www.flipkart.com/"],
  ["Meesho","https://www.meesho.com/"],
  ["Myntra","https://www.myntra.com/"],
  ["AJIO","https://www.ajio.com/"],
  ["Tata CLiQ","https://www.tatacliq.com/"],
  ["Shopsy","https://www.shopsy.in/"]
];

function getProducts(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){
    return [];
  }
}

function esc(v){
  return String(v || "").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

/* ENTER SENGOL */

function initWelcome(){
  const screen=document.getElementById("welcome-screen");
  const btn=document.getElementById("enter-site");

  if(!screen) return;

  if(btn){
    btn.onclick=function(e){
      e.preventDefault();
      screen.classList.add("hide");
      document.body.style.overflow="";
    };
  }

  setTimeout(()=>{
    screen.classList.add("hide");
  },7000);
}

/* MOBILE MENU */

function initMenu(){
  const btn=document.getElementById("menu-btn");
  const menu=document.getElementById("main-menu");

  if(!btn || !menu) return;

  btn.onclick=function(){
    menu.classList.toggle("menu-open");
    btn.setAttribute(
      "aria-expanded",
      menu.classList.contains("menu-open")
    );
  };

  menu.querySelectorAll("a").forEach(a=>{
    a.onclick=()=>{
      menu.classList.remove("menu-open");
    };
  });
}

/* SHOPPING */

function renderPlatforms(){
  const grid=document.getElementById("platform-grid");
  if(!grid) return;

  grid.innerHTML=PLATFORMS.map((p,i)=>`
    <button class="platform-card" type="button"
      onclick="openPlatform(${i})">
      <div class="platform-logo">${esc(p[0])}</div>
      <span>Explore →</span>
    </button>
  `).join("");
}

function openPlatform(i){
  const p=PLATFORMS[i];
  const modal=document.getElementById("platform-modal");
  const title=document.getElementById("platform-title");
  const actions=document.getElementById("platform-actions");

  if(!p || !modal) return;

  title.textContent=p[0];

  actions.innerHTML=`
    <a class="btn primary"
       href="${p[1]}"
       target="_blank"
       rel="noopener">
       🛍️ Visit ${esc(p[0])}
    </a>
  `;

  modal.hidden=false;
}

/* PRODUCTS */

function renderProducts(){
  const grid=document.getElementById("product-grid");
  const empty=document.getElementById("empty-products");
  const search=(document.getElementById("product-search")?.value||"").toLowerCase();
  const category=document.getElementById("category-filter")?.value||"all";

  if(!grid) return;

  const list=getProducts().filter(p=>{
    const name=(p.name||"").toLowerCase();
    const desc=(p.description||"").toLowerCase();

    return(
      (category==="all" || p.category===category) &&
      (!search || name.includes(search) || desc.includes(search))
    );
  });

  grid.innerHTML=list.map(p=>`
    <article class="product-card">

      <div class="product-image">
        ${p.image
          ? `<img src="${esc(p.image)}"
               alt="${esc(p.name)}"
               loading="lazy">`
          : `<div style="height:100%;display:grid;place-items:center">
               SENGOL
             </div>`
        }
      </div>

      <p class="product-category">
        ${esc(p.category || "Other")}
      </p>

      <h3>${esc(p.name || "Sengol Product")}</h3>

      <p>${esc(p.description || "")}</p>

      ${p.price ? `<p class="product-price">₹${esc(p.price)}</p>` : ""}

      <p>⭐ ${esc(p.rating || "5")} / 5</p>

      ${
        p.link
        ? `<a class="btn primary"
             href="${esc(p.link)}"
             target="_blank"
             rel="noopener">
             Shop Now →
           </a>`
        : `<button class="btn primary" disabled>
             Link Coming Soon
           </button>`
      }

    </article>
  `).join("");

  if(empty) empty.hidden=list.length>0;
}

/* SOCIAL */

function renderSocials(){
  const grid=document.getElementById("social-grid");
  if(!grid) return;

  grid.innerHTML=SOCIALS.map(s=>`
    <a class="social-card"
       href="${s[1]}"
       target="_blank"
       rel="noopener">
       ${esc(s[0])} →
    </a>
  `).join("");
}

/* LOGIN */

function initAuth(){
  const modal=document.getElementById("auth-modal");
  const login=document.getElementById("login-btn");
  const close=document.querySelectorAll(".close-modal");

  if(login && modal){
    login.onclick=()=>{
      modal.hidden=false;
    };
  }

  close.forEach(btn=>{
    btn.onclick=()=>{
      const id=btn.dataset.close;
      const m=document.getElementById(id);
      if(m) m.hidden=true;
    };
  });
}

/* AFFILIATE */

function initAffiliate(){
  const btn=document.getElementById("generate-affiliate");
  const input=document.getElementById("affiliate-source");
  const result=document.getElementById("affiliate-result");

  if(!btn || !input || !result) return;

  btn.onclick=()=>{
    const url=input.value.trim();

    if(!url){
      result.textContent="Please paste an affiliate URL.";
      return;
    }

    try{
      new URL(url);

      result.innerHTML=`
        <p>Affiliate link ready:</p>
        <input value="${esc(url)}" readonly>
        <button class="btn primary" id="copy-affiliate">
          Copy Link
        </button>
      `;

      document.getElementById("copy-affiliate").onclick=()=>{
        navigator.clipboard.writeText(url)
          .then(()=>alert("Link copied!"));
      };

    }catch(e){
      result.textContent="Please enter a valid URL.";
    }
  };
}

/* SEARCH */

function initSearch(){
  const search=document.getElementById("product-search");
  const category=document.getElementById("category-filter");

  if(search) search.oninput=renderProducts;
  if(category) category.onchange=renderProducts;
}

/* CLOSE MODALS */

function initModalClose(){
  document.querySelectorAll(".modal").forEach(modal=>{
    modal.addEventListener("click",e=>{
      if(e.target===modal) modal.hidden=true;
    });
  });

  document.querySelectorAll(".close-modal").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id=btn.dataset.close;
      const modal=document.getElementById(id);
      if(modal) modal.hidden=true;
    });
  });
}

/* START WEBSITE */

document.addEventListener("DOMContentLoaded",()=>{
  initWelcome();
  initMenu();
  renderPlatforms();
  renderProducts();
  renderSocials();
  initAuth();
  initAffiliate();
  initSearch();
  initModalClose();
});
