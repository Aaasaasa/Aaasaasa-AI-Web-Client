<template>
    <div>
        <h1>About Aaasaasa AI Web Client App</h1>
        
    </div>
    <article>
  <header>
    <h1>Aaasaasa: A Local AI Stack Built for Scale</h1>
    <p><em>Multi‑provider CLI + High‑capacity Web Client for ultra‑long sessions and on‑prem performance.</em></p>
  </header>

  <section>
    <h2>Is There Anything Like This?</h2>
    <p>
      Not really. Existing tools are siloed:
      <strong>Ollama</strong> focuses on local models only; <strong>vLLM</strong> exposes a single server;
      vendor CLIs target their own APIs; GUI apps emphasize convenience over orchestration.
      None unify <strong>multi‑provider routing</strong>, <strong>load balancing</strong>, and a
      <strong>high‑capacity ChatGPT Web client</strong> tuned for extremely long sessions.
    </p>
  </section>

  <section>
    <h2>What Makes Aaasaasa AI Different</h2>
    <ul>
      <li><strong>Unified, multi‑provider CLI</strong> — one tool for Ollama, vLLM, OpenAI/Anthropic (extensible), with profiles and per‑model routing.</li>
      <li><strong>Production‑grade load balancing</strong> — strategies like <em>round_robin</em>, <em>least_conn</em>, and <em>power‑of‑two choices (p2c)</em> applied to LLM backends.</li>
      <li><strong>Intelligent failover</strong> — automatic fallback from cloud (e.g., API quota hit) to local nodes; optional multi‑key rotation to spread usage across accounts.</li>
      <li><strong>Local‑first performance</strong> — pushes work to on‑prem GPUs/CPUs via Ollama/vLLM for low latency and data locality.</li>
      <li><strong>High‑capacity Web Client</strong> — a dedicated Chromium launcher for ChatGPT with isolated profile, large JS heap, GPU rasterization, and no background throttling; built for 1000+ message sessions.</li>
      <li><strong>Separation of concerns</strong> — CLI for orchestration; Web client for human interaction with maximum stability and memory headroom.</li>
      <li><strong>Brandable & private</strong> — Aaasaasa Studio by Aleks: local configs, optional on‑prem gateway, no vendor lock‑in.</li>
    </ul>
  </section>

  <section>
    <h2>Advantages Over Other Tools</h2>
    <ul>
      <li><strong>One interface, many backends</strong> — switch between local clusters and cloud models without changing workflows.</li>
      <li><strong>Resilience by design</strong> — quota errors or node outages don’t halt work; 3a2a routes around failures automatically.</li>
      <li><strong>Massive session support</strong> — the Web client avoids typical browser constraints by using an isolated profile and aggressive performance flags.</li>
      <li><strong>Edge & on‑prem friendly</strong> — keep data near you, use your 64&nbsp;GB+ RAM and local GPUs to accelerate response time.</li>
    </ul>
  </section>

  <section>
    <h2>Features No One Else Combines</h2>
    <ul>
      <li><strong>CLI + Web synergy</strong> — send the same task to local LLMs (CLI) or ChatGPT (Web) with consistent behavior.</li>
      <li><strong>LB algorithms for LLMs</strong> — web‑inspired balancing (least‑connections, p2c) applied to inference endpoints.</li>
      <li><strong>Key rotation + fallback chain</strong> — gracefully move from one API key/provider to another, then to on‑prem models.</li>
      <li><strong>Ultra‑long chats</strong> — specialized ChatGPT launcher tuned for huge conversations that overwhelm normal browsers.</li>
    </ul>
  </section>

  <section>
    <h2>Roadmap</h2>
    <ul>
      <li><strong>Aaasaasa Gateway (Aaasaasa)</strong> — a lightweight on‑prem router for all LLM traffic (already prototyped).</li>
      <li><strong>Auto‑model selection</strong> — choose models by task type, latency budget, or cost.</li>
      <li><strong>Cluster controls</strong> — health checks, EWMA latency scoring, hedged requests, and adaptive concurrency.</li>
      <li><strong>Advanced Web automations</strong> — optional scripting/injection layer for power‑workflows in the ChatGPT client.</li>
    </ul>
  </section>

  <section>
    <h2>Who Is It For?</h2>
    <p>
      Power users, teams, and labs that need <strong>reliable, fast, and scalable</strong> AI workflows,
      combining <strong>local models</strong> for speed/privacy with <strong>cloud models</strong> when needed —
      without ever getting stuck on quota, memory, or browser limits.
    </p>
  </section>




  <footer>
    <p><strong>Aaasaasa Studio — by Aleks</strong> · Local‑first AI at production scale.</p>
  </footer>
</article>
<section id="pricing">
  <h2>Pricing</h2>
  <p><strong>3a2a™</strong> is proprietary software licensed per machine, per month.</p>

  <div class="plans">
    <div class="plan">
      <h3>Starter</h3>
      <p class="price">$49 / machine / month</p>
      <ul>
        <li>Single-node license</li>
        <li>Local Ollama + vLLM integration</li>
        <li>Basic load balancing</li>
        <li>Community support</li>
      </ul>
    </div>

    <div class="plan popular">
      <h3>Professional</h3>
      <p class="price">$199 / machine / month</p>
      <ul>
        <li>All Starter features</li>
        <li>Multi-provider profiles (OpenAI, Anthropic…)</li>
        <li>Failover + key rotation</li>
        <li>Priority updates & support</li>
      </ul>
    </div>

    <div class="plan">
      <h3>Enterprise</h3>
      <p class="price">$499 / node / month</p>
      <ul>
        <li>Cluster orchestration</li>
        <li>Advanced load balancing (EWMA, p2c, hedged requests)</li>
        <li>Dedicated support channel</li>
        <li>Custom branding & SLA</li>
      </ul>
    </div>

  </div>
</section>

</template>

<script>
export default {
    name: 'AboutPage'
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>