/**
 * Hook for V2 API usage
 */
export declare function useV2Api(): any;
/**
 * Example usage in a React component:
 *
 * ```tsx
 * function CampaignList() {
 *   const v2Api = useV2Api();
 *   const [campaigns, setCampaigns] = useState([]);
 *   const [loading, setLoading] = useState(false);
 *
 *   useEffect(() => {
 *     const loadCampaigns = async () => {
 *       if (!v2Api.isInitialized) return;
 *
 *       setLoading(true);
 *       try {
 *         const result = await v2Api.campaign.list();
 *         setCampaigns(result.campaigns);
 *       } catch (_error) {
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadCampaigns();
 *   }, [v2Api.isInitialized]);
 *
 *   return (
 *     <div>
 *       <p>Using V2 API with Protobuf</p>
 *       {loading ? (
 *         <p>Loading campaigns...</p>
 *       ) : (
 *         <ul>
 *           {campaigns.map(campaign => (
 *             <li key={campaign.id}>{campaign.name}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
