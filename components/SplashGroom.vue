<template>
  <!--
    Groom – single-line sketch, side profile facing LEFT (towards the bride).
    Shares the 360×460 scene viewBox with SplashBride so both layers line up.
    Every stroke uses pathLength="1" so the splash can "draw" it.
  -->
  <svg
    viewBox="0 0 360 460"
    class="figure h-full w-full overflow-visible"
    fill="#FFFDFB"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Coat tails (behind the legs, flaring back) -->
    <path pathLength="1" d="M256 212C262 250 270 285 278 316L293 309C285 280 276 246 270 212Z" />
    <path pathLength="1" fill="none" d="M266 240C272 265 278 288 284 306" />

    <!-- Far leg (swings from the hip at 262,216) -->
    <g transform="translate(262 216)">
      <g class="leg leg--far">
        <g transform="translate(-262 -216)">
          <path pathLength="1" d="M254 230C259 300 263 360 264 419L284 419C282 360 277 290 270 214Z" />
          <path pathLength="1" d="M264 419C258 425 254 431 256 436C264 439 276 439 286 438C287 432 286 425 284 419Z" />
        </g>
      </g>
    </g>

    <!-- Near leg -->
    <g transform="translate(242 216)">
      <g class="leg leg--near">
        <g transform="translate(-242 -216)">
          <path pathLength="1" d="M230 214C229 290 227 360 225 421L249 421C250 360 252 290 256 218Z" />
          <path pathLength="1" fill="none" d="M226 412L249 412" />
          <path pathLength="1" d="M225 421C216 425 208 431 207 436C212 440 232 440 250 439C251 433 250 426 249 421Z" />
        </g>
      </g>
    </g>

    <!-- Neck -->
    <path pathLength="1" d="M232 96L233 115L257 115L258 86Z" />

    <!-- Tailcoat body -->
    <path
      pathLength="1"
      d="M232 112C222 120 219 140 221 160C223 182 226 202 228 216L254 216C258 214 264 214 269 214C271 190 274 160 273 134C273 120 266 112 258 108Z"
    />
    <g fill="none">
      <!-- shirt collar & bow tie -->
      <path pathLength="1" d="M232 112L238 121L245 112" />
      <path pathLength="1" d="M233 120L238 122L233 125Z" />
      <!-- lapel & waistcoat edge -->
      <path pathLength="1" d="M245 113L240 132L237 150L238 204" />
      <path pathLength="1" d="M226 128L230 200" />
      <!-- cut-away front of the tailcoat -->
      <path pathLength="1" d="M238 204C244 212 252 216 260 216" />
      <path pathLength="1" d="M262 140C264 165 264 190 262 212" />
    </g>
    <circle pathLength="1" cx="232" cy="172" r="1.2" />
    <circle pathLength="1" cx="232" cy="188" r="1.2" />

    <!-- Head: face profile + hair -->
    <path
      pathLength="1"
      d="M226 58C223 64 223 70 223 73L217 82C219 84 221 85 222 86C220 88 221 90 222 91C221 94 222 97 226 99C232 102 240 102 246 98C254 96 260 92 262 88C266 80 269 72 268 64C268 50 260 40 248 39C236 38 226 46 226 58Z"
    />
    <g fill="none">
      <path pathLength="1" d="M226 58C232 57 238 54 242 50C246 58 252 63 258 65C258 74 260 82 262 88" />
      <path pathLength="1" d="M234 45C241 47 249 45 257 49" />
      <path pathLength="1" d="M244 40C252 42 260 48 264 57" />
      <path pathLength="1" d="M251 71C257 69 259 80 253 85" />
      <path pathLength="1" d="M225 67.5L231 66.5" />
      <path pathLength="1" d="M226 72.5C228 71.5 230 71.5 231 72.5" />
      <path pathLength="1" d="M223 93L227 93.5" />
    </g>

    <!-- Near arm (pivots at the shoulder 256,126) – reaches for the bride's hands -->
    <g transform="translate(256 126)">
      <g class="arm arm--groom">
        <g transform="translate(-256 -126)">
          <path
            pathLength="1"
            d="M252 124C249 150 249 170 250 184C238 189 224 194 210 198L212 211C228 209 244 205 260 199C263 176 264 150 263 126C260 121 255 121 252 124Z"
          />
          <path pathLength="1" fill="none" d="M215 197.5L217 210.5" />
          <path pathLength="1" d="M210 198C203 197 197 199 193 203C191 207 195 211 201 211L212 211Z" />
          <path pathLength="1" fill="none" d="M197 205L205 206M198 208.5L206 209" />
        </g>
      </g>
    </g>
  </svg>
</template>
