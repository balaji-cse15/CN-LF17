import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Product URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping product URL:', formattedUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['extract'],
        extract: {
          schema: {
            type: 'object',
            properties: {
              product_name: { type: 'string', description: 'The name of the product' },
              category: {
                type: 'string',
                enum: ['electronics', 'clothing', 'books', 'furniture', 'food', 'beauty', 'toys', 'home'],
                description: 'The product category. Choose the closest match.'
              },
              weight_kg: {
                type: 'number',
                description: 'Estimated weight in kg. If not listed, estimate from product type.'
              },
              materials: {
                type: 'array',
                items: { type: 'string' },
                description: 'Materials (e.g., plastic, cotton, metal, wood)'
              },
              price: { type: 'string', description: 'Product price with currency' },
              description: { type: 'string', description: 'Brief 1-2 sentence description' },
              brand: { type: 'string', description: 'Brand or manufacturer' },
              is_eco_friendly: {
                type: 'boolean',
                description: 'Whether marketed as eco-friendly or sustainable'
              }
            },
            required: ['product_name', 'category', 'weight_kg', 'materials']
          },
          prompt: 'Extract product details from this e-commerce page. Estimate weight if not listed. Identify materials from specs or descriptions.'
        },
        onlyMainContent: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Scraping failed (${response.status})` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JSON data from response
    const productData = data?.data?.extract || data?.extract || null;

    if (!productData) {
      console.error('No product data extracted:', JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'Could not extract product information from this page. Make sure it is a valid product page.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Product data extracted:', JSON.stringify(productData));

    return new Response(
      JSON.stringify({ success: true, product: productData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze product';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
