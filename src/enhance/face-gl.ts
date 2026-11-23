/**
 * The portrait's reveal: the cursor paints a trail into a small framebuffer
 * that fades on its own, and wherever the trail is the portrait turns from
 * grayscale into a blueprint of itself (edges in white on blue). The trail's
 * edge is bent by a swirl of noise, and the whole picture leans a hair with the
 * pointer. Two passes per frame, both on one 2D quad: one writes the trail, one
 * draws the portrait through it.
 *
 * This is an enhancement over the still <img> in the markup, and it gives that
 * image back whenever anything goes wrong: no WebGL, a shader that will not
 * compile, a lost context. The image is only hidden (class `gl`) after the first
 * frame has been drawn, so there is never a frame with neither.
 *
 * The page's own images and nothing else are read as textures, so there is no
 * cross-origin concern. Ported from the owner's brainstorm mockup; the trail
 * technique follows his hillaryrainara stage-gl shaders.
 */

const NOISE = `float h21(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+1.),u.x),u.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.02+vec2(11.3,7.9);a*=.5;}return s/.875;}
float swirl(vec2 p,float t){vec2 q=vec2(fbm(p+t),fbm(p+vec2(5.2,1.3)-t));return fbm(p+2.6*q);}`

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}'

/** Pass one: fade the last trail and add a soft line from where the pointer was to where it is. */
const TRAIL = `precision highp float;varying vec2 v;uniform sampler2D P;uniform vec2 a,b;uniform float r,k,t;${NOISE}
void main(){float m=max(texture2D(P,v).r*.982-.0012,0.);vec2 pa=v-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-5),0.,1.);
float d=length(pa-ba*h);float rr=r*(.75+.6*fbm(v*5.+t*.1));float br=(1.-smoothstep(rr*.15,rr,d))*k;m=1.-(1.-m)*(1.-br);gl_FragColor=vec4(m,m,m,1);}`

/** Pass two: the portrait in grayscale, and the blueprint of it where the trail is. */
const MAIN = `precision highp float;varying vec2 v;uniform sampler2D A,M;uniform vec2 tilt,px;uniform float t;${NOISE}
vec2 uv(vec2 q){return vec2(q.x,1.-q.y);}
void main(){vec2 q=v;q+=tilt*.006;
vec4 a=texture2D(A,uv(q));float l=dot(a.rgb,vec3(.3,.59,.11));vec3 ga=vec3(pow(l,1.05));
float e=0.;for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++){if(i==0&&j==0)continue;e+=abs(dot(texture2D(A,uv(q+vec2(i,j)*px)).rgb,vec3(.33))-l);}
vec3 gb=mix(vec3(.10,.20,.95),vec3(1.),smoothstep(.12,.5,e))+vec3(.06)*step(.985,fract((q.y)*120.));
float m=texture2D(M,v).r;float n=swirl(q*5.,t*.04);float r=m<.05?0.:smoothstep(.38,.62,m*1.15+(n-.5)*.5);
float al=a.a;gl_FragColor=vec4(mix(ga,gb,r)*al,al);}`

/** The trail's resolution: it is a mask, so it is coarse on purpose. */
const TRAIL_SIZE = 256

type Pair = [number, number]

function shader(g: WebGLRenderingContext, kind: number, source: string): WebGLShader {
  const s = g.createShader(kind)
  if (!s) throw new Error('no shader')
  g.shaderSource(s, source)
  g.compileShader(s)
  if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error('shader did not compile')
  return s
}

function program(g: WebGLRenderingContext, fragment: string): WebGLProgram {
  const p = g.createProgram()
  g.attachShader(p, shader(g, g.VERTEX_SHADER, VS))
  g.attachShader(p, shader(g, g.FRAGMENT_SHADER, fragment))
  g.linkProgram(p)
  if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error('program did not link')
  return p
}

/** Returns whether the effect was mounted; false leaves the still image alone. */
export function mountFaceGL(face: HTMLElement): boolean {
  const img = face.querySelector('img')
  if (!img) return false
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  const g = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true })
  if (!g) return false

  let trailProgram: WebGLProgram
  let mainProgram: WebGLProgram
  try {
    trailProgram = program(g, TRAIL)
    mainProgram = program(g, MAIN)
  } catch {
    return false
  }
  face.append(canvas)

  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer())
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW)
  const bindProgram = (p: WebGLProgram) => {
    g.useProgram(p)
    const loc = g.getAttribLocation(p, 'p')
    g.enableVertexAttribArray(loc)
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0)
  }
  const at = (p: WebGLProgram, name: string) => g.getUniformLocation(p, name)
  const linear = () => {
    for (const k of [g.TEXTURE_MIN_FILTER, g.TEXTURE_MAG_FILTER]) g.texParameteri(g.TEXTURE_2D, k, g.LINEAR)
    for (const k of [g.TEXTURE_WRAP_S, g.TEXTURE_WRAP_T]) g.texParameteri(g.TEXTURE_2D, k, g.CLAMP_TO_EDGE)
  }

  // Two trail buffers, swapped each frame: one is read while the other is written.
  const buffers = [0, 1].map(() => {
    const texture = g.createTexture()
    g.bindTexture(g.TEXTURE_2D, texture)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, TRAIL_SIZE, TRAIL_SIZE, 0, g.RGBA, g.UNSIGNED_BYTE, null)
    linear()
    const framebuffer = g.createFramebuffer()
    g.bindFramebuffer(g.FRAMEBUFFER, framebuffer)
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0)
    return { texture, framebuffer }
  })

  let current = 0
  let previous: Pair = [0.5, 0.5]
  let smoothed: Pair = [0.5, 0.5]
  let target: Pair = [0.5, 0.5]
  let inside = 0
  let tilt: Pair = [0, 0]
  let tiltTarget: Pair = [0, 0]
  let visible = true
  let raf = 0
  let first = true
  let lost = false

  // The still image comes back if the browser takes the context away.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault()
    lost = true
    face.classList.remove('gl')
    canvas.remove()
  })

  face.addEventListener(
    'pointermove',
    (e) => {
      const b = face.getBoundingClientRect()
      target = [(e.clientX - b.left) / b.width, 1 - (e.clientY - b.top) / b.height]
      inside = 1
    },
    { passive: true },
  )
  face.addEventListener('pointerleave', () => {
    inside = 0
  })
  window.addEventListener(
    'pointermove',
    (e) => {
      tiltTarget = [(e.clientX / window.innerWidth - 0.5) * 2, (0.5 - e.clientY / window.innerHeight) * 2]
    },
    { passive: true },
  )

  const image = new Image()
  image.onload = () => {
    const portrait = g.createTexture()
    g.activeTexture(g.TEXTURE0)
    g.bindTexture(g.TEXTURE_2D, portrait)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, image)
    linear()

    const loop = (t: number) => {
      if (lost) return
      const b = face.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      if (canvas.width !== Math.round(b.width * dpr)) {
        canvas.width = Math.round(b.width * dpr)
        canvas.height = Math.round(b.height * dpr)
      }

      previous = smoothed
      smoothed = [smoothed[0] + (target[0] - smoothed[0]) * 0.12, smoothed[1] + (target[1] - smoothed[1]) * 0.12]
      const speed = Math.hypot(smoothed[0] - previous[0], smoothed[1] - previous[1])
      tilt = [tilt[0] + (tiltTarget[0] - tilt[0]) * 0.04, tilt[1] + (tiltTarget[1] - tilt[1]) * 0.04]

      bindProgram(trailProgram)
      g.bindFramebuffer(g.FRAMEBUFFER, buffers[1 - current].framebuffer)
      g.viewport(0, 0, TRAIL_SIZE, TRAIL_SIZE)
      g.activeTexture(g.TEXTURE1)
      g.bindTexture(g.TEXTURE_2D, buffers[current].texture)
      g.uniform1i(at(trailProgram, 'P'), 1)
      g.uniform2f(at(trailProgram, 'a'), previous[0], previous[1])
      g.uniform2f(at(trailProgram, 'b'), smoothed[0], smoothed[1])
      g.uniform1f(at(trailProgram, 'r'), 0.09 + Math.min(speed * 2, 0.08))
      g.uniform1f(at(trailProgram, 'k'), inside * Math.min(0.6, 0.18 + speed * 12))
      g.uniform1f(at(trailProgram, 't'), t / 1000)
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4)
      current = 1 - current

      bindProgram(mainProgram)
      g.bindFramebuffer(g.FRAMEBUFFER, null)
      g.viewport(0, 0, canvas.width, canvas.height)
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT)
      g.activeTexture(g.TEXTURE0)
      g.bindTexture(g.TEXTURE_2D, portrait)
      g.uniform1i(at(mainProgram, 'A'), 0)
      g.activeTexture(g.TEXTURE1)
      g.bindTexture(g.TEXTURE_2D, buffers[current].texture)
      g.uniform1i(at(mainProgram, 'M'), 1)
      g.uniform2f(at(mainProgram, 'tilt'), tilt[0], tilt[1])
      g.uniform2f(at(mainProgram, 'px'), 1.5 / image.width, 1.5 / image.height)
      g.uniform1f(at(mainProgram, 't'), t / 1000)
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4)

      if (first) {
        first = false
        face.classList.add('gl')
      }
      raf = visible ? requestAnimationFrame(loop) : 0
    }

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(loop)
    }).observe(face)
    raf = requestAnimationFrame(loop)
  }
  image.src = img.currentSrc || img.src
  return true
}
