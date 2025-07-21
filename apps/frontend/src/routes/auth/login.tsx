import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type FC,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CustomBlending,
  GLSL3,
  type Mesh,
  OneFactor,
  SrcAlphaFactor,
  ShaderMaterial as ThreeShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/auth/login')({
  component: Login,
});

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, // This controls the direction
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean; // This prop determines the direction
}) => {
  return (
    <div className={cn('relative h-full w-full', containerClassName)}>
      {' '}
      {/* Removed bg-white */}
      <div className="h-full w-full">
        <DotMatrix
          center={['x', 'y']}
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          // Pass reverse state and speed via string flags in the empty shader prop
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
        />
      </div>
      {showGradient && (
        // Adjust gradient colors if needed based on background (was bg-white, now likely uses containerClassName bg)
        // Example assuming a dark background like the SignInPage uses:
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ('x' | 'y')[];
}

const DotMatrix: FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = '', // This shader string will now contain the animation logic
  center = ['x', 'y'],
}) => {
  // ... uniforms calculation remains the same for colors, opacities, etc.
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: 'uniform3fv',
      },
      u_opacities: {
        value: opacities,
        type: 'uniform1fv',
      },
      u_total_size: {
        value: totalSize,
        type: 'uniform1f',
      },
      u_dot_size: {
        value: dotSize,
        type: 'uniform1f',
      },
      u_reverse: {
        value: shader.includes('u_reverse_active') ? 1 : 0, // Convert boolean to number (1 or 0)
        type: 'uniform1i', // Use 1i for bool in WebGL1/GLSL100, or just bool for GLSL300+ if supported
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]); // Add shader to dependencies

  return (
    <Shader
      // The main animation logic is now built *outside* the shader prop
      maxFps={60}
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse; // Changed from bool to int

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes('x')
                ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }
            ${
              center.includes('y')
                ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
                : ''
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2); // Used for initial opacity random pick and color
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            // --- Animation Timing Logic ---
            float animation_speed_factor = 0.5; // Extract speed from shader string
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            // Calculate timing offset for Intro (from center)
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            // Calculate timing offset for Outro (from edges)
            // Max distance from center to a corner of the grid
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 // Outro logic: opacity starts high, goes to 0 when time passes offset
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-out transition
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 // Intro logic: opacity starts 0, goes to base opacity when time passes offset
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-in transition
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a; // Premultiply alpha
        }`}
      uniforms={uniforms}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  hovered?: boolean;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const timestamp = clock.getElapsedTime();

    const material = ref.current.material as ThreeShaderMaterial;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = useMemo(() => {
    const preparedUniforms: Record<string, { value: unknown; type?: string }> =
      {};

    for (const [uniformName, uniform] of Object.entries(uniforms)) {
      switch (uniform.type) {
        case 'uniform1f':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1f',
          };
          break;
        case 'uniform1i':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1i',
          };
          break;
        case 'uniform3f':
          preparedUniforms[uniformName] = {
            value: new Vector3().fromArray(uniform.value as number[]),
            type: '3f',
          };
          break;
        case 'uniform1fv':
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: '1fv',
          };
          break;
        case 'uniform3fv':
          preparedUniforms[uniformName] = {
            value: (uniform.value as number[][]).map((v: number[]) =>
              new Vector3().fromArray(v)
            ),
            type: '3fv',
          };
          break;
        case 'uniform2f':
          preparedUniforms[uniformName] = {
            value: new Vector2().fromArray(uniform.value as number[]),
            type: '2f',
          };
          break;
        default:
          break;
      }
    }

    preparedUniforms.u_time = { value: 0, type: '1f' };
    preparedUniforms.u_resolution = {
      value: new Vector2(size.width * 2, size.height * 2),
    }; // Initialize u_resolution
    return preparedUniforms;
  }, [uniforms, size.width, size.height]);

  // Shader material
  const material = useMemo(() => {
    const materialObject = new ThreeShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms,
      glslVersion: GLSL3,
      blending: CustomBlending,
      blendSrc: SrcAlphaFactor,
      blendDst: OneFactor,
    });

    return materialObject;
  }, [source, getUniforms]);

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
};

const Shader: FC<ShaderProps> = ({ source, uniforms }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} />
    </Canvas>
  );
};

function Login({ className }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep('code');
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          // First show the new reverse canvas
          setReverseCanvasVisible(true);

          // Then hide the original canvas after a small delay
          setTimeout(() => {
            setInitialCanvasVisible(false);
          }, 50);

          // Transition to success screen after animation
          setTimeout(() => {
            setStep('success');
          }, 2000);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep('email');
    setCode(['', '', '', '', '', '']);
    // Reset animations if going back
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className={cn('relative flex grow flex-col', className)}>
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mt-[150px] w-full max-w-sm">
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                  exit={{ opacity: 0, x: -100 }}
                  initial={{ opacity: 0, x: -100 }}
                  key="email-step"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="space-y-1">
                    <h1 className="font-bold text-[2.5rem] text-white leading-[1.1] tracking-tight">
                      Welcome Developer
                    </h1>
                    <p className="font-light text-[1.8rem] text-white/70">
                      Your sign in component
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit}>
                    <div className="relative">
                      <input
                        className="w-full rounded-full border-1 border-white/10 px-4 py-3 text-center text-white backdrop-blur-[1px] focus:border focus:border-white/30 focus:outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@gmail.com"
                        required
                        type="email"
                        value={email}
                      />
                      <button
                        className="group absolute top-1.5 right-1.5 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        type="submit"
                      >
                        <span className="relative block h-full w-full overflow-hidden">
                          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                            →
                          </span>
                          <span className="-translate-x-full absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0">
                            →
                          </span>
                        </span>
                      </button>
                    </div>
                  </form>

                  <p className="pt-10 text-white/40 text-xs">
                    By signing up, you agree to sell me your soul and other
                    blah-di-fucking-blah.
                  </p>
                </motion.div>
              )}
              {step === 'code' && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                  exit={{ opacity: 0, x: 100 }}
                  initial={{ opacity: 0, x: 100 }}
                  key="code-step"
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="space-y-1">
                    <h1 className="font-bold text-[2.5rem] text-white leading-[1.1] tracking-tight">
                      We sent you a code
                    </h1>
                    <p className="font-light text-[1.25rem] text-white/50">
                      Please enter it
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="relative rounded-full border border-white/10 bg-transparent px-5 py-4">
                      <div className="flex items-center justify-center">
                        {code.map((digit, i) => (
                          <div className="flex items-center" key={`${digit}`}>
                            <div className="relative">
                              <input
                                className="w-8 appearance-none border-none bg-transparent text-center text-white text-xl focus:outline-none focus:ring-0"
                                inputMode="numeric"
                                maxLength={1}
                                onChange={(e) =>
                                  handleCodeChange(i, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                pattern="[0-9]*"
                                ref={(el) => {
                                  codeInputRefs.current[i] = el;
                                }}
                                style={{ caretColor: 'transparent' }}
                                type="text"
                                value={digit}
                              />
                              {!digit && (
                                <div className="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center justify-center">
                                  <span className="text-white text-xl">0</span>
                                </div>
                              )}
                            </div>
                            {i < 5 && (
                              <span className="text-white/20 text-xl">|</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <motion.p
                      className="cursor-pointer text-sm text-white/50 transition-colors hover:text-white/70"
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Resend code
                    </motion.p>
                  </div>

                  <div className="flex w-full gap-3">
                    <motion.button
                      className="w-[30%] rounded-full bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-white/90"
                      onClick={handleBackClick}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      className={`flex-1 rounded-full border py-3 font-medium transition-all duration-300 ${
                        code.every((d) => d !== '')
                          ? 'cursor-pointer border-transparent bg-white text-black hover:bg-white/90'
                          : 'cursor-not-allowed border-white/10 bg-[#111] text-white/50'
                      }`}
                      disabled={!code.every((d) => d !== '')}
                    >
                      Continue
                    </motion.button>
                  </div>

                  <div className="pt-16">
                    <p className="text-white/40 text-xs">
                      By signing up, you agree to the{' '}
                      <Link
                        className="text-white/40 underline transition-colors hover:text-white/60"
                        to="/"
                      >
                        MSA
                      </Link>
                      ,{' '}
                      <Link
                        className="text-white/40 underline transition-colors hover:text-white/60"
                        to="/"
                      >
                        Product Terms
                      </Link>
                      ,{' '}
                      <Link
                        className="text-white/40 underline transition-colors hover:text-white/60"
                        to="/"
                      >
                        Policies
                      </Link>
                      ,{' '}
                      <Link
                        className="text-white/40 underline transition-colors hover:text-white/60"
                        to="/"
                      >
                        Privacy Notice
                      </Link>
                      , and{' '}
                      <Link
                        className="text-white/40 underline transition-colors hover:text-white/60"
                        to="/"
                      >
                        Cookie Notice
                      </Link>
                      .
                    </p>
                  </div>
                </motion.div>
              )}
              {step === 'success' && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center"
                  initial={{ opacity: 0, y: 50 }}
                  key="success-step"
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                >
                  <div className="space-y-1">
                    <h1 className="font-bold text-[2.5rem] text-white leading-[1.1] tracking-tight">
                      You're in!
                    </h1>
                    <p className="font-light text-[1.25rem] text-white/50">
                      Welcome
                    </p>
                  </div>

                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/70">
                      <svg
                        className="h-8 w-8 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Checkmark</title>
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.button
                    animate={{ opacity: 1 }}
                    className="w-full rounded-full bg-white py-3 font-medium text-black transition-colors hover:bg-white/90"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Continue to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
