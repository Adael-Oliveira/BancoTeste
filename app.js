import { createClient } from "https://esm.sh/@supabase/supabase-js";

// CONFIGURE AQUI
const SUPABASE_URL = "https://rotsqebfbpbufrbupqfj.supabase.co";
const SUPABASE_ANON = "SEU_ANON_PUBLICeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdHNxZWJmYnBidWZyYnVwcWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NDg3NDEsImV4cCI6MjA3OTMyNDc0MX0.oSCdV9fl0d6OVu_i_IkrTLN7xmdb7n-AMbDTaHUZfhQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const authContainer = document.getElementById("auth-container");
const appContainer = document.getElementById("app-container");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-signup").onclick = signup;
document.getElementById("btn-logout").onclick = logout;
document.getElementById("btn-add").onclick = adicionarItem;

// --------------------
// AUTENTICAÇÃO
// --------------------

async function login() {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) return alert("Erro ao entrar: " + error.message);
  carregarInterface();
}

async function signup() {
  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) return alert("Erro ao cadastrar: " + error.message);
  alert("Conta criada com sucesso! Verifique seu e-mail.");
}

async function logout() {
  await supabase.auth.signOut();
  carregarInterface();
}

// --------------------
// INTERFACE
// --------------------

async function carregarInterface() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    carregarLista();
  } else {
    appContainer.classList.add("hidden");
    authContainer.classList.remove("hidden");
  }
}

carregarInterface();

// --------------------
// CRUD BÁSICO
// --------------------

async function carregarLista() {
  const { data, error } = await supabase
    .from("itens")
    .select("*")
    .order("id", { ascending: true });

  if (error) return alert("Erro ao carregar: " + error.message);

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.texto;
    lista.appendChild(li);
  });
}

async function adicionarItem() {
  const texto = document.getElementById("item-text").value;

  const { error } = await supabase
    .from("itens")
    .insert([{ texto }]);

  if (error) return alert("Erro ao adicionar: " + error.message);

  document.getElementById("item-text").value = "";
  carregarLista();
}
