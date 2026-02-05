import sys
import os

new_feed_item_code = r"""
interface FeedItemProps {
  product: DisplayProduct;
  isActive?: boolean;
  phone: string;
  setPhone: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  isFormFilled: boolean;
  shouldAnimateAbsorb: boolean;
  handleMpesa: () => void;
  setActiveProduct: (p: DisplayProduct) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({
  product,
  isActive = false,
  phone,
  setPhone,
  location,
  setLocation,
  isFormFilled,
  shouldAnimateAbsorb,
  handleMpesa,
  setActiveProduct
}) => {
  const { addItem, isInCart: checkInCart } = useCartStore();
  const { showToast } = useUIStore();
  const isInCart = checkInCart(product.id);

  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  // Default to false (collapsed)
  const [isEditMode, setIsEditMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');

  const deliveryCost = location.length > 3 ? 150 : 0;

  const handleAddToCart = (p: Product) => {
    addItem(p);
    showToast('Added to cart', 'success');
  };

  return (
    <div className="feed-item h-full w-full snap-start relative flex flex-col bg-black shrink-0">
        <Helmet>
          <title>{product.name} | SokoSnap</title>
          <meta name="description" content={product.description} />
        </Helmet>

        <div className="feed-media absolute inset-0 z-0">
          {product.type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              src={product.mediaUrl}
            />
          ) : (
            <>
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse" />
              )}
              <img
                src={product.mediaUrl}
                alt={product.name}
                className={`h-full w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          )}
          <div className="feed-gradient absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        </div>

        <div className="feed-actions absolute right-4 bottom-28 z-30 flex flex-col items-center gap-6 pb-4">
          <ActionBtn
            icon={<Heart size={26} className="text-white" />}
            label={product.likes !== undefined ? String(product.likes) : '0'}
            ariaLabel={`Like, ${product.likes} likes`}
          />
          <ActionBtn
            icon={<MessageCircle size={24} />}
            label={product.comments !== undefined ? String(product.comments) : '0'}
            ariaLabel={`Comments, ${product.comments}`}
          />
          <ActionBtn
            icon={<ShoppingCart size={24} className={isInCart ? "text-white" : ""} />}
            label="Cart"
            onClick={() => handleAddToCart(product)}
            isActive={isInCart}
            ariaLabel={isInCart ? "In cart" : "Add to cart"}
          />
          <ActionBtn
            icon={<Share2 size={22} />}
            label="Share"
            ariaLabel="Share product"
          />
        </div>

        <div className="feed-info relative z-20 mt-auto px-4 pb-6 space-y-2 max-w-[95%] w-full mx-auto">
          <div className="feed-seller-tag flex items-center gap-2 mb-1 animate-in slide-in-from-bottom duration-500 delay-100">
            <div className="w-9 h-9 rounded-full border border-white/50 overflow-hidden p-0.5 bg-black/20 backdrop-blur-sm shadow-sm shrink-0">
              <img
                src={product.sellerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`}
                alt="avatar"
                className="w-full h-full rounded-full bg-white object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`;
                }}
              />
            </div>
            <div className="flex flex-col leading-none justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{product.sellerName || product.sellerHandle}</span>
                {product.verified && (
                  <CheckCircle2 size={12} className="text-emerald-400 drop-shadow-md" />
                )}
              </div>
              <span className="text-[10px] text-white/90 font-medium tracking-wide drop-shadow-md">is selling</span>
            </div>
          </div>

          <div className="space-y-1 drop-shadow-md animate-in slide-in-from-bottom duration-500 delay-200">
            <h2 className="text-lg font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight mb-1 line-clamp-2">
              {product.name}
            </h2>

            <div className="block">
              <div className={`transition-all duration-200 ${isExpanded ? 'max-h-[120px] overflow-y-auto pr-1' : ''}`}>
                  <p className={`text-white/95 text-sm font-medium leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {product.description}
                  </p>
              </div>
              {product.description && product.description.length > 80 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                  className="text-white/80 text-xs font-bold mt-0.5 hover:text-white transition-colors cursor-pointer uppercase tracking-wider drop-shadow-md"
                >
                  {isExpanded ? 'Show less' : '...more'}
                </button>
              )}
               <div className="mt-1">
                <span className="font-bold text-white text-xs opacity-90 drop-shadow-md">#SokoSnap</span>
              </div>
            </div>
          </div>

          <div className="mt-2 animate-in slide-in-from-bottom duration-500 delay-300 relative group/commerce flex flex-col items-stretch gap-0">
            <div className="w-full z-30 mb-0 pb-0 relative">
              
              {!isEditMode && isFormFilled && (
                <div className="bg-[#FFC107] rounded-t-xl rounded-b-none py-1 px-3 shadow-lg animate-in slide-in-from-bottom fade-in duration-300 relative mx-0 z-10 w-full mb-0 border-b-0 pb-1 cursor-pointer" onClick={() => setIsEditMode(true)}>
                  <div className="flex items-center justify-center gap-2 text-center w-full relative">
                    <span className="text-[9px] font-bold text-black truncate max-w-[80%]">
                      Pay via <span className="font-normal">{phone}</span> <span className="mx-1 font-black text-[10px] text-black">•</span> To <span className="font-normal">{location}</span>
                    </span>
                    <button
                      className="absolute right-0 text-[8px] font-black text-black underline uppercase hover:opacity-70 whitespace-nowrap"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* CENTERED HINT TEXT with START Button */}
              {!isEditMode && !isFormFilled && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 border-b-0 rounded-t-xl py-1.5 px-3 shadow-lg animate-in slide-in-from-bottom fade-in duration-300 relative mx-0 z-10 w-full mb-0 pb-2 cursor-pointer" onClick={() => setIsEditMode(true)}>
                  <div className="flex items-center justify-center relative w-full h-full">
                       <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">
                         Tap to fill delivery info
                       </span>
                       <div className="absolute right-0 bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                         Start
                       </div>
                   </div>
                </div>
              )}

              {isEditMode && (
                <div className="bg-black/60 backdrop-blur-xl border border-b-0 border-[#FFC107] rounded-t-xl p-2 pb-0 mb-0 shadow-2xl animate-in slide-in-from-bottom fade-in duration-300 relative mx-0 z-10 w-full mb-0 !rounded-b-none">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-black text-white px-1.5 py-0.5 rounded bg-white/10 uppercase tracking-widest shadow-sm">
                      SokoSnap Secure Checkout
                    </span>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="bg-[#FFC107] text-black px-2 py-0.5 rounded-full text-[8px] font-bold uppercase hover:bg-yellow-400/90 transition-colors shadow-sm"
                    >
                      Done
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-lg flex items-center p-0.5 focus-within:bg-emerald-500/10 focus-within:border-emerald-500/50 transition-colors group relative overflow-hidden h-8">
                        {paymentMethod === 'mpesa' && <div className="absolute inset-y-0 left-0 w-0.5 bg-emerald-500 rounded-l-md" />}

                        <div className="w-6 h-full flex items-center justify-center text-emerald-500 group-focus-within:scale-110 transition-transform">
                          <Smartphone size={14} />
                        </div>
                        <div className="flex-1 pr-1 min-w-0">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-transparent font-bold text-[10px] text-white outline-none placeholder:text-white/20 h-full"
                            placeholder="M-Pesa Number"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setPaymentMethod(paymentMethod === 'mpesa' ? 'cod' : 'mpesa')}
                        className={`px-1 rounded-lg border flex flex-col items-center justify-center text-[6px] font-bold uppercase transition-all shrink-0 w-12 h-8 
                                            ${paymentMethod === 'cod'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                          }`}
                      >
                        <Banknote size={12} className="mb-0.5" />
                        <span className="text-center leading-none">Cash</span>
                      </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg flex items-center p-0.5 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-colors group h-8">
                      <div className="w-6 h-full flex items-center justify-center text-blue-400 group-focus-within:scale-110 transition-transform">
                        <MapPin size={14} />
                      </div>
                      <div className="flex-1 pr-1">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-transparent font-bold text-[10px] text-white outline-none placeholder:text-white/20 h-full"
                          placeholder="Delivery Location"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (isEditMode) {
                  setIsEditMode(false);
                } else if (!isFormFilled) {
                  setIsEditMode(true);
                } else {
                  setActiveProduct(product);
                  handleMpesa();
                }
              }}
              className={`action-btn w-full relative z-20 !bg-black/60 backdrop-blur-xl border border-t-0 border-[#FFC107] rounded-none !rounded-t-none shadow-[0_-4px_20px_rgba(0,0,0,0.2)] outline-none ring-0 active:scale-[0.99] transition-all duration-300 !mt-0 -mt-px !h-auto !min-h-0 !p-0 ${shouldAnimateAbsorb ? 'animate-absorb-highlight' : ''} ${isFormFilled && !isEditMode ? 'animate-pulse shadow-[0_0_20px_rgba(255,193,7,0.4)]' : ''}`}
              aria-label={`Buy Now ${product.name}`}
            >
              <div className="action-primary-row h-10 flex items-center justify-between px-3">
                <div className="flex items-center h-full">
                  <img
                    src={lipaNaMpesaLogo}
                    alt="Lipa na M-Pesa"
                    className="action-mpesa-logo h-full object-contain scale-110 origin-left"
                  />
                </div>

                <div className="flex flex-col items-center justify-center -space-y-0.5 mx-auto">
                  <span className="text-[7px] font-bold text-white/40 tracking-[0.2em] uppercase mb-0.5">Tap To</span>
                  <span className="text-base font-black italic text-[#FFC107] tracking-tighter drop-shadow-sm">ORDER NOW</span>
                </div>
                <div className="flex flex-col items-end leading-none">
                  <span className="action-price text-sm text-white font-black font-mono drop-shadow-md">{formatCurrency(product.price)}</span>
                  <span className="text-[8px] font-bold font-mono text-[#FFC107] mt-0.5 tracking-wide uppercase drop-shadow-sm">+ {deliveryCost > 0 ? formatCurrency(deliveryCost) : 'Delivery'}</span>
                </div>
              </div>
            </button>

            <div className="flex justify-center mt-1 pb-1">
              <div className="flex items-center gap-1.5 opacity-60">
                <ShieldCheck size={8} className="text-[#4CAF50]" />
                <span className="text-[8px] font-bold text-white uppercase tracking-wider">
                  Secure Hold by SokoSnap: Funds released after verification.
                </span>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
};
"""

file_path = "src/components/CheckoutFeed.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove old FeedItem
start_marker = "const FeedItem = ({ product, isActive }: { product: Product; isActive: boolean }) => {"
end_marker = "// --- RESTORED CHECKOUT SHEET"

start_idx = content.find(start_marker)
if start_idx != -1:
    end_idx = content.find(end_marker, start_idx)
    # Move back to find the closing brace before the comment, including whitespace
    # We want to remove the function definition.
    # We can effectively replace everything from start_idx to the line before end_marker.
    # But we need to be careful about not deleting the CheckoutSheet component start.
    # The end_marker is a comment inside CheckoutSheet? No, wait.
    # Let's see the previous structure:
    #   }; (End of FeedItem)
    #   // --- RESTORED CHECKOUT SHEET
    #   const CheckoutSheet = ...
    
    # So finding end_marker is correct. We want to delete up to it.
    
    # To be safe, let's include the whitespace up to the definition of new const if possible.
    content = content[:start_idx] + "\n  " + content[end_idx:]

# 2. Insert new FeedItem before CheckoutFeed
insert_marker = "export const CheckoutFeed: React.FC<CheckoutFeedProps> ="
insert_idx = content.find(insert_marker)

if insert_idx != -1:
    content = content[:insert_idx] + new_feed_item_code + "\n\n" + content[insert_idx:]

# 3. Update Usage
usage_old = "<FeedItem product={p} />"
usage_new = """<FeedItem 
              product={p} 
              phone={phone}
              setPhone={setPhone}
              location={location}
              setLocation={setLocation}
              isFormFilled={isFormFilled}
              shouldAnimateAbsorb={shouldAnimateAbsorb}
              handleMpesa={handleMpesa}
              setActiveProduct={setActiveProduct}
            />"""

content = content.replace(usage_old, usage_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("CheckoutFeed.tsx successfully refactored.")
