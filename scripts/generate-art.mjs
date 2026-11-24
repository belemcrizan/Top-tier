// Every mark in these prints is drawn here so the collection can be reproduced without photos.
import { writeFileSync } from 'node:fs';

function wrapSvg(source) {
  return source
    .split('\n')
    .flatMap((line) => {
      const words = line.trim().split(/\s+/);
      const rows = [''];
      for (const word of words) {
        const n = rows.length - 1;
        if (rows[n].length + word.length > 98) rows.push(word);
        else rows[n] = rows[n] ? `${rows[n]} ${word}` : word;
      }
      return rows;
    })
    .join('\n');
}
const svg = (width, height, content) =>
  wrapSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  ${content}
  </svg>`);
const range = (size, callback) => Array.from({ length: size }, (_, i) => callback(i)).join('\n');
const branch = (x, y, angle, size, ink) => `
  <g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})" fill="none"
    stroke="${ink}" stroke-linecap="round" stroke-linejoin="round">
    <path d="M0 0Q9 -39 0 -89" stroke-width="1.9"/>
    ${range(5, (i) => {
      const yy = -10 - 14 * i;
      const dir = i % 2 === 0 ? 1 : -1;
      return `<g transform="translate(3 ${yy}) scale(${dir} 1)">
        <path d="M0 0Q8 -19 29 -22Q24 -6 0 0ZM0 0L23 -17" stroke-width="1.3"/>
        <path d="M9 -7L12 -13M15 -11L21 -12" stroke-width=".8"/></g>`;
    })}
  </g>`;
const trees = (x, y, count, color, step, mul) =>
  `<g fill="${color}">${range(count, (i) => {
    const h = (27 + ((i * 73) % 37)) * mul;
    const w = h * 0.39;
    return `<g transform="translate(${x + i * step} ${y - ((i * 13) % 11)})">
      <path d="M0 ${-h}L${w * 0.24} ${-h * 0.69}L${w * 0.12} ${-h * 0.71}
      L${w * 0.53} ${-h * 0.4}L${w * 0.32} ${-h * 0.44}L${w} 0H${-w}L${-w * 0.3} ${-h * 0.44}
      L${-w * 0.56} ${-h * 0.38}L${-w * 0.13} ${-h * 0.71}L${-w * 0.29} ${-h * 0.66}Z"/>
      </g>`;
  })}</g>`;
const star = (x, y, r, color) => `<path fill="${color}" transform="translate(${x} ${y})"
  d="M0 ${-r}Q1 -1 ${r} 0Q1 1 0 ${r}Q-1 1 ${-r} 0Q-1 -1 0 ${-r}Z"/>`;
const hatch = (ink) => `<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse">
  <path d="M0 7L7 0" stroke="${ink}" stroke-width=".8" opacity=".5"/></pattern>`;
const gradient = (a, b) => `<linearGradient id="wash" x2="1" y2="1"
  gradientUnits="objectBoundingBox"><stop stop-color="${a}"/><stop offset="1"
  stop-color="${b}"/></linearGradient>`;
const corners = (ink) => `<g stroke="${ink}" fill="none" opacity=".64">
  <path d="M13 32V13H32M328 13H347V32M13 168V187H32M328 187H347V168"/></g>`;
const candle = `
  <defs>${gradient('#f9e9ce', '#d5a77f')}${hatch('#8b5539')}</defs>
  <rect width="360" height="200" fill="url(#wash)"/>
  <g stroke="#94674a" fill="none" opacity=".3">
    ${range(8, (i) => `<ellipse cx="182" cy="107" rx="${65 + i * 6}" ry="${68 + i * 6}"/>`)}
  </g>
  <circle cx="182" cy="103" r="67" fill="#eed4ad"/>
  ${branch(102, 182, -28, 1.3, '#8c5c3d')}${branch(119, 166, -49, 0.83, '#a17250')}
  ${branch(241, 190, 28, 1.35, '#81523b')}${branch(258, 169, 46, 1.05, '#ac7a55')}
  <g stroke="#70442f" stroke-linejoin="round">
    <path d="M161 90Q177 84 198 91V155Q181 162 161 154Z" fill="#dfab79"/>
    <path d="M166 102V148M170 125V154M192 103V146M186 122V154" fill="none" opacity=".55"/>
    <path d="M160 90Q178 81 199 90Q201 95 196 100Q193 104 192 96Q189 91 183 97
      Q178 103 176 97T164 97Q160 96 160 90Z" fill="#f9e7bf"/>
    <path d="M179 90Q177 79 181 73" fill="none" stroke-width="2"/>
    <path d="M180 80Q159 64 181 40Q179 52 190 61Q197 75 180 80Z" fill="#a76239"/>
    <path d="M181 77Q174 69 182 58Q181 65 186 69Q188 75 181 77Z" fill="#f3d79b"/>
    <path d="M139 154Q184 161 218 151Q209 168 185 171H170Q151 167 139 154Z"
      fill="url(#hatch)"/>
  </g>
  ${star(140, 51, 5, '#855a3a')}${star(217, 60, 4, '#855a3a')}${corners('#895c42')}`;
const forest = `
  <defs>${gradient('#e7ead8', '#aebfb0')}${hatch('#587061')}</defs>
  <rect width="360" height="200" fill="url(#wash)"/>
  <circle cx="206" cy="75" r="46" fill="#f4ead1"/>
  <g fill="none" stroke="#80927f" opacity=".55">
    ${range(
      8,
      (i) => `<path d="M0 ${90 + i * 3}Q104 ${37 + i * 3} 173 ${85 + i * 3}
      T360 ${65 + i * 3}"/>`,
    )}
  </g>
  <path fill="#a0afa0" d="M0 128Q59 92 114 111T230 97T360 101V200H0Z"/>
  ${trees(-5, 136, 24, '#8b9e8c', 17, 0.6)}
  <path fill="#c6cebb" d="M0 144Q63 116 142 134T275 119T375 123V166H0Z"/>
  ${trees(-8, 159, 19, '#677f71', 21, 0.85)}
  <path fill="#acbba9" d="M0 162Q52 139 146 153T279 143T360 139V205H0Z"/>
  ${trees(-1, 195, 16, '#486556', 26, 1.05)}
  <path d="M0 190Q106 160 165 182T360 165V200H0Z" fill="#486556"/>
  ${trees(30, 203, 2, '#304d42', 299, 2.28)}
  ${corners('#657b67')}`;
const snake = `
  <defs>${gradient('#dedbd4', '#adaeb2')}${hatch('#596068')}</defs>
  <rect width="360" height="200" fill="url(#wash)"/>
  <g stroke="#687076" opacity=".45">
    ${range(
      26,
      (i) => `<path d="M${23 + ((i * 7) % 15)} ${30 + i * 5.5}
      h${50 - ((i * 11) % 24)}M${272 + ((i * 5) % 12)} ${20 + i * 6.3}h${55 - (i % 13)}"/>`,
    )}
  </g>
  <g stroke="#777d82" opacity=".33" fill="none">
    ${range(13, (i) => `<ellipse cx="178" cy="103" rx="${62 + i * 4}" ry="${50 + i * 4}"/>`)}
  </g>
  <path d="M111 153L156 165L213 151L218 130L194 117L147 109L134 91L144 62L180 48
    L218 55L232 70L226 83L205 82L205 74L180 65L158 74L151 88L159 97L206 107L234 123
    L235 150L218 163L177 173L145 173Z" fill="#47505c" stroke="#363e48" stroke-width="2"/>
  <path d="M115 154L157 168L216 155L226 132L202 114L148 106L141 89L150 68L179 56
    L211 61L225 72" fill="none" stroke="#b9b6a8" stroke-width="2"/>
  <path d="M150 68L158 74M164 61L169 69M181 49L180 65M195 52L193 69M220 59L215 68
    M137 85L151 88M144 101L155 96M169 105L167 112M182 107L180 115M198 110L194 117
    M227 121L218 130M234 139L217 138M216 162L210 152M196 166L195 158M172 171L174 162"
    stroke="#c2c2bd" stroke-width="1.3" fill="none"/>
  <circle cx="223" cy="72" r="2.4" fill="#eae2cb"/>
  <path d="M231 79L243 85L250 81M243 85L249 89" stroke="#47505c" fill="none"/>
  ${star(107, 70, 6, '#69717a')}${star(247, 115, 4, '#69717a')}${corners('#56606a')}`;
const outputs = { evermore: candle, folklore: forest, reputation: snake };
for (const [album, content] of Object.entries(outputs)) {
  writeFileSync(`public/images/${album}.svg`, svg(360, 200, content));
}

// The sleeve is an imaginary release made from engraved curves and a small botanical monogram.
const orbit = (r, opacity) => `<circle r="${r}" stroke="#dbb8a1" fill="none"
  stroke-width=".8" opacity="${opacity}"/>`;
const hero = `<defs>
    <linearGradient id="disc" x2="1" y2=".8" gradientUnits="objectBoundingBox">
      <stop stop-color="#1b181f"/><stop offset=".24" stop-color="#30272e"/>
      <stop offset=".42" stop-color="#74615f"/><stop offset=".53" stop-color="#42383c"/>
      <stop offset=".76" stop-color="#211e25"/><stop offset="1" stop-color="#54484b"/>
    </linearGradient>
    <linearGradient id="sleeve" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#d89a73"/><stop offset=".40" stop-color="#c48360"/>
      <stop offset="1" stop-color="#9d5d47"/>
    </linearGradient>
    <radialGradient id="glow"><stop stop-color="#ad7261" stop-opacity=".42"/>
      <stop offset="1" stop-color="#ad7261" stop-opacity="0"/></radialGradient>
    <pattern id="cloth" width="4" height="4" patternUnits="userSpaceOnUse">
      <path d="M0 0V4M0 2H4" fill="none" stroke="#f4d4aa" stroke-width=".35"/>
    </pattern>
    <clipPath id="sun"><circle r="64"/></clipPath>
  </defs>
  <ellipse cx="330" cy="220" rx="264" ry="184" fill="url(#glow)"/>
  <g fill="none" stroke="#deb99a" stroke-width=".6" opacity=".38">
    <ellipse cx="323" cy="202" rx="263" ry="146" transform="rotate(-15 323 202)"/>
    <ellipse cx="323" cy="202" rx="281" ry="159" transform="rotate(-15 323 202)"/>
  </g>
  <g transform="translate(381 171) rotate(-19)">
    <circle r="126" fill="url(#disc)" stroke="#ad9290" stroke-width="1.6"/>
    ${range(36, (i) => orbit(49 + i * 2.1, 0.2 + (i % 4) * 0.1))}
    <circle r="43" fill="#e5bf92"/><circle r="39" fill="none" stroke="#915f50"/>
    <path d="M-32 0Q0 -18 32 0M-30 7Q0 -11 30 7M-24 14Q0 0 24 14"
      fill="none" stroke="#a56b56"/>
    <circle r="4.5" fill="#31252c"/>
  </g>
  <g transform="translate(144 72) rotate(-11 109 115)">
    <path d="M9 10H238V241H9Z" fill="#201923" opacity=".28"/>
    <path d="M0 0H228V230H0Z" fill="url(#sleeve)" stroke="#e6b68f" stroke-width="2"/>
    <rect width="228" height="230" fill="url(#cloth)" opacity=".64"/>
    <g fill="none" stroke="#f3d3a7" stroke-width=".8">
      <rect x="8" y="8" width="212" height="214"/>
      <rect x="13" y="13" width="202" height="204"/>
      <path d="M13 43Q42 43 42 13M185 13Q185 43 215 43M13 187Q43 187 43 217
        M185 217Q185 187 215 187"/>
      <path d="M34 115H194M114 35V194" opacity=".45"/>
      <ellipse cx="114" cy="115" rx="76" ry="78"/>
      <circle cx="114" cy="115" r="69" stroke-dasharray="2 3"/>
    </g>
    <g transform="translate(114 115)" fill="none" stroke="#f4d5a8">
      <circle r="63"/>
      <g clip-path="url(#sun)" opacity=".65">
        ${range(
          16,
          (i) => `<path d="M-75 ${19 + i * 4}Q-30 ${-15 + i * 4} 6 ${8 + i * 4}
          T75 ${-13 + i * 4}" stroke-width=".8"/>`,
        )}
      </g>
      <path d="M-2 43Q7 9 0 -26M0 -8Q-16 -28 -29 -24Q-23 -9 0 -8ZM3 -1
        Q19 -23 34 -17Q25 0 3 -1ZM-1 -23Q-8 -41 4 -48Q10 -35 -1 -23Z"
        fill="#f4d5a8" stroke-width="1.5"/>
    </g>
    ${star(113, 21, 3.6, '#f1d3ac')}${star(113, 209, 3.6, '#f1d3ac')}
  </g>
  ${star(110, 113, 8, '#edcba5')}${star(429, 38, 7, '#edcba5')}
  ${star(482, 296, 11, '#edcba5')}${star(125, 300, 4, '#edcba5')}
  ${range(
    22,
    (i) => `<circle cx="${45 + ((i * 59) % 505)}" cy="${17 + ((i * 89) % 305)}"
    r="${i % 4 === 0 ? 1.7 : 1}" fill="#f0d2ae" opacity=".52"/>`,
  )}`;
writeFileSync('public/images/listening-room.svg', svg(590, 365, hero));
