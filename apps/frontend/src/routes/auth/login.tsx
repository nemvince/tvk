import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CanvasRevealBackground } from '@/components/canvas-reveal-background';
import { o } from '@/lib/orpc';

export const Route = createFileRoute('/auth/login')({
  component: Login,
});

function Login() {
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendActive, setIsResendActive] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const [step, setStep] = useState<'email' | 'code' | 'success' | 'error'>(
    'email'
  );

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const requestOtpMutator = useMutation(o.auth.requestOtp.mutationOptions());
  const signInMutator = useMutation(o.auth.signIn.mutationOptions());

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: handle resend logic with timer
      requestOtpMutator.mutate(
        {
          type: 'sign-in',
          email,
        },
        {
          onSuccess: () => {
            setStep('code');
          },
        }
      );
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

      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          setIsLoading(true);
          signInMutator.mutate(
            {
              email,
              otp: newCode.join(''),
            },
            {
              onSuccess: () => {
                // First show the new reverse canvas
                setReverseCanvasVisible(true);

                // Then hide the original canvas after a small delay
                setTimeout(() => {
                  setInitialCanvasVisible(false);
                }, 50);

                // Transition to success screen after animation
                setTimeout(() => {
                  setStep('success');
                  setIsLoading(false);
                }, 2000);
              },
              onError: (_) => {
                // First show the new reverse canvas
                setReverseCanvasVisible(true);

                // Then hide the original canvas after a small delay
                setTimeout(() => {
                  setInitialCanvasVisible(false);
                }, 50);

                // Transition to success screen after animation
                setTimeout(() => {
                  setStep('error');
                  setIsLoading(false);
                }, 2000);
              },
            }
          );
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = (to: 'email' | 'code') => {
    setStep(to);
    setCode(['', '', '', '', '', '']);
    // Reset animations if going back
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  const handleResendCode = () => {
    requestOtpMutator.mutate(
      {
        type: 'sign-in',
        email,
      },
      {
        onSuccess: () => {
          setCode(['', '', '', '', '', '']);
          // TODO: Show success message or notification
        },
        onError: (_) => {
          // TODO: Handle error (e.g., show notification)
        },
      }
    );
    setIsResendActive(false);
  };

  return (
    <div className="relative flex grow flex-col">
      <CanvasRevealBackground
        initialCanvasVisible={initialCanvasVisible}
        reverseCanvasVisible={reverseCanvasVisible}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
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
                    Welcome, Developer
                  </h1>
                  <p className="font-light text-[1.8rem] text-white/70">
                    Please sign in with your email
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit}>
                  <div className="relative">
                    <input
                      className="w-full rounded-full border-1 border-white/10 px-4 py-3 text-center text-white backdrop-blur-[1px] focus:border focus:border-white/30 focus:outline-none"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="someone@tvk.lol"
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

                <div className="space-y-4 pt-10 text-white/40 text-xs">
                  <p>
                    No account yet?{' '}
                    <Link
                      className="text-white/40 underline transition-colors hover:text-white/60"
                      to="/"
                    >
                      Sign up
                    </Link>
                  </p>
                  <p>
                    By signing up, you agree to sell me your soul and other
                    blah-di-fucking-blah.
                  </p>
                </div>
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
                        <div
                          className="flex items-center"
                          key={`code-input-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: shhhhh
                            i
                          }`}
                        >
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
                                <span className="text-white text-xl">_</span>
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
                  <motion.button
                    className="cursor-pointer text-sm text-white/50 transition-colors hover:text-white/70"
                    disabled={isResendActive}
                    onClick={handleResendCode}
                    transition={{ duration: 0.2 }}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                  >
                    Resend code
                  </motion.button>
                </div>

                <motion.button
                  className="w-[30%] rounded-full bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-white/90 disabled:bg-white/30"
                  disabled={isLoading}
                  onClick={() => handleBackClick('email')}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
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
            {step === 'error' && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
                initial={{ opacity: 0, y: 50 }}
                key="error-step"
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
              >
                <div className="space-y-1">
                  <h1 className="font-bold text-[2.5rem] text-white leading-[1.1] tracking-tight">
                    That's not right
                  </h1>
                  <p className="font-light text-[1.25rem] text-white/50">
                    Please try again.
                  </p>
                </div>

                <motion.button
                  animate={{ opacity: 1 }}
                  className="w-full rounded-full bg-white py-3 font-medium text-black transition-colors hover:bg-white/90"
                  initial={{ opacity: 0 }}
                  onClick={() => handleBackClick('code')}
                  transition={{ delay: 1 }}
                >
                  Go back
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
