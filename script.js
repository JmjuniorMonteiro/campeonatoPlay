// ===== TIMES =====
const times = [
    "Ath. Bilbao (Lucas)",
    "B. Dortmund (Heitor)",
    "Chelsea (Euler)",
    "Juventus (Júnior)",
    "Milan (Myckson)",
    "Tottenham (Gilciney)"
];

// ===== ESCUDOS =====
const escudos = {
    "Ath. Bilbao (Lucas)": "img/bilbao.png",
    "B. Dortmund (Heitor)": "img/dortmund.png",
    "Chelsea (Euler)": "img/chelsea.png",
    "Juventus (Júnior)": "img/juventus.png",
    "Milan (Myckson)": "img/milan.png",
    "Tottenham (Gilciney)": "img/tottenham.png"
};

function formatarNomeTime(nome, escudo) {
    const match = nome.match(/^(.*)\s\((.*)\)$/);
    if (!match) return nome;

    return `
        <span class="linha-time">
            <span class="nome-time">${match[1]}</span>
            <img src="${escudo}" class="escudo-inline">
        </span>
        <span class="nome-jogador">(${match[2]})</span>
    `;
}



// ===== BASE =====
const tabela = {};
const confrontoDireto = {};

times.forEach(t => {
    tabela[t] = { pts:0, v:0, e:0, d:0, gp:0, gc:0, sg:0 };
    confrontoDireto[t] = {};
    times.forEach(o => confrontoDireto[t][o] = 0);
});

// ===== RODADAS =====
const rodadas = [
    {
        nome: "1ª Rodada",
        jogos: [
            {a:times[2], b:times[1], ga:3, gb:1},
            {a:times[5], b:times[4], ga:6, gb:5},
            {a:times[3], b:times[0], ga:6, gb:6}
        ]
    },
    {
        nome: "2ª Rodada",
        jogos: [
            {a:times[3], b:times[2], ga:5, gb:2},
            {a:times[0], b:times[5], ga:5, gb:5},
            {a:times[4], b:times[1], ga:4, gb:9}
        ]
    },
    {
        nome: "3ª Rodada",
        jogos: [
            {a:times[2], b:times[4], ga:null, gb:null},
            {a:times[1], b:times[0], ga:null, gb:null},
            {a:times[5], b:times[3], ga:null, gb:null}
        ]
    },
    {
        nome: "4ª Rodada",
        jogos: [
            {a:times[5], b:times[2], ga:null, gb:null},
            {a:times[3], b:times[1], ga:null, gb:null},
            {a:times[0], b:times[4], ga:null, gb:null}
        ]
    },
    {
        nome: "5ª Rodada",
        jogos: [
            {a:times[2], b:times[0], ga:null, gb:null},
            {a:times[4], b:times[3], ga:null, gb:null},
            {a:times[1], b:times[5], ga:null, gb:null}
        ]
    },
    {
        nome: "6ª Rodada",
        jogos: [
            {a:times[1], b:times[2], ga:null, gb:null},
            {a:times[4], b:times[5], ga:null, gb:null},
            {a:times[0], b:times[2], ga:null, gb:null}
        ]
    },
    {
        nome: "7ª Rodada",
        jogos: [
            {a:times[2], b:times[3], ga:null, gb:null},
            {a:times[5], b:times[0], ga:null, gb:null},
            {a:times[1], b:times[4], ga:null, gb:null}
        ]
    },
    {
        nome: "8ª Rodada",
        jogos: [
            {a:times[4], b:times[2], ga:null, gb:null},
            {a:times[0], b:times[1], ga:null, gb:null},
            {a:times[3], b:times[5], ga:null, gb:null}
        ]
    },
    {
        nome: "9ª Rodada",
        jogos: [
            {a:times[2], b:times[5], ga:null, gb:null},
            {a:times[1], b:times[3], ga:null, gb:null},
            {a:times[4], b:times[0], ga:null, gb:null}
        ]
    },
    {
        nome: "10ª Rodada",
        jogos: [
            {a:times[0], b:times[2], ga:null, gb:null},
            {a:times[3], b:times[4], ga:null, gb:null},
            {a:times[5], b:times[1], ga:null, gb:null}
        ]
    }
];

// ===== UTIL =====
function todasRodadasConcluidas() {
    return rodadas.every(r =>
        r.jogos.every(j => j.ga !== null && j.gb !== null)
    );
}

function resetTabela() {
    times.forEach(t => {
        tabela[t] = { pts:0, v:0, e:0, d:0, gp:0, gc:0, sg:0 };
        times.forEach(o => confrontoDireto[t][o] = 0);
    });
}

// ===== PROCESSAMENTO =====
function processar() {
    resetTabela();

    rodadas.forEach(r => {
        r.jogos.forEach(j => {
            if (j.ga === null || j.gb === null) return;

            const A = tabela[j.a];
            const B = tabela[j.b];

            A.gp += j.ga; A.gc += j.gb;
            B.gp += j.gb; B.gc += j.ga;

            A.sg = A.gp - A.gc;
            B.sg = B.gp - B.gc;

            confrontoDireto[j.a][j.b] = j.ga - j.gb;
            confrontoDireto[j.b][j.a] = j.gb - j.ga;

            if (j.ga > j.gb) {
                A.pts += 3; A.v++; B.d++;
            } else if (j.gb > j.ga) {
                B.pts += 3; B.v++; A.d++;
            } else {
                A.pts++; B.pts++; A.e++; B.e++;
            }
        });
    });
}

// ===== CLASSIFICAÇÃO =====
function classificacao() {
    return [...times].sort((a,b)=>{
        const A = tabela[a];
        const B = tabela[b];
        return (
            B.pts - A.pts ||
            B.v - A.v ||
            B.sg - A.sg ||
            B.gp - A.gp ||
            confrontoDireto[a][b]
        );
    });
}

function renderTabela() {
    const c = classificacao();

    let html = `
        <tr>
            <th>#</th><th>Time</th><th>P</th>
            <th>V</th><th>E</th><th>D</th>
            <th>GP</th><th>GC</th><th>SG</th>
        </tr>`;

    c.forEach((t,i)=>{
        const classe = i < 4 ? "classificado" : "eliminado";
        const d = tabela[t];

        html += `
            <tr class="${classe}">
                <td>${i+1}</td>
                <td class="time-cell">
                    ${formatarNomeTime(t, escudos[t])}
                </td>
                <td>${d.pts}</td>
                <td>${d.v}</td>
                <td>${d.e}</td>
                <td>${d.d}</td>
                <td>${d.gp}</td>
                <td>${d.gc}</td>
                <td>${d.sg}</td>
            </tr>`;
    });

    document.getElementById("classificacao").innerHTML = html;

    document.getElementById("criterios").innerHTML = `
        <div class="criterios">
            <strong>Critérios de desempate</strong>
            <ol>
                <li>Pontos</li>
                <li>Vitórias</li>
                <li>Saldo de gols</li>
                <li>Gols pró</li>
                <li>Confronto direto</li>
                <li>Sorteio</li>
            </ol>
        </div>
    `;
}

// ===== RODADAS =====
function renderRodadas() {
    let html = "";
    rodadas.forEach(r => {
        html += `<h3>${r.nome}</h3>`;
        r.jogos.forEach(j => {
            html += `
            <div class="jogo">
                <span class="time-esq">
                    ${formatarNomeTime(j.a, escudos[j.a])}
                </span>
                <span class="placar">${j.ga ?? "—"} x ${j.gb ?? "—"}</span>
                <span class="time-dir">
                    ${formatarNomeTime(j.b, escudos[j.b])}
                </span>
            </div>`;
        });
    });
    document.getElementById("rodadas").innerHTML = html;
}

// ===== SEMIFINAL =====
function renderSemifinal() {
    if (!todasRodadasConcluidas()) {
        document.getElementById("semifinal").innerHTML = `
            <div class="jogo">
                <span class="time-esq">1º Colocado</span>
                <span class="placar">— x —</span>
                <span class="time-dir">4º Colocado</span>
            </div>
            <div class="jogo">
                <span class="time-esq">2º Colocado</span>
                <span class="placar">— x —</span>
                <span class="time-dir">3º Colocado</span>
            </div>
        `;
        return;
    }

    const c = classificacao();
    document.getElementById("semifinal").innerHTML = `
        <div class="jogo">
            <span class="time-esq">${formatarNomeTime(c[0], escudos[c[0]])}</span>
            <span class="placar">— x —</span>
            <span class="time-dir">${formatarNomeTime(c[3], escudos[c[3]])}</span>
        </div>
        <div class="jogo">
            <span class="time-esq">${formatarNomeTime(c[1], escudos[c[1]])}</span>
            <span class="placar">— x —</span>
            <span class="time-dir">${formatarNomeTime(c[2], escudos[c[2]])}</span>
        </div>
    `;
}


// ===== FINAL =====
function renderFinal() {
    document.getElementById("final").innerHTML = `
        <div class="jogo">
            <span class="time-esq">Vencedor SF1</span>
            <span class="placar">— x —</span>
            <span class="time-dir">Vencedor SF2</span>
        </div>
    `;

    // document.getElementById("final").innerHTML = `
    // <div class="jogo">
    //     <span class="time-esq">${formatarNomeTime(times[2], escudos[times[2]])}</span>
    //     <span class="placar">— x —</span>
    //     <span class="time-dir">${formatarNomeTime(times[3], escudos[times[3]])}</span>
    // </div>
    // `;
}

// ===== INIT =====
function atualizar() {
    processar();
    renderTabela();
    renderRodadas();
    renderSemifinal();
    renderFinal();
}

atualizar();
