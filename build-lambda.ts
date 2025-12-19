import { build } from "esbuild";
import { execSync } from "child_process";

interface LambdaConfig {
    entry: string;
    out: string;
    zip: string;
}

const lambdas: LambdaConfig[] = [
    { entry: "src/image-resize/index.ts", out: "dist/image-resize/index.js", zip: "dist/image-resize/index.zip" },
    { entry: "src/api/index.ts", out: "dist/api/index.js", zip: "dist/api/index.zip" },
    { entry: "src/get-image/index.ts", out: "dist/get-image/index.js", zip: "dist/get-image/index.zip" },
];

async function main() {
    for (const fn of lambdas) {
        console.log(`🔨 Building: ${fn.entry}`);
        await build({
            entryPoints: [fn.entry],
            outfile: fn.out,
            bundle: true,
            platform: "node",
            target: "node20",
            minify: false,
        });

        console.log(`📦 Zipping -> ${fn.zip}`);
        execSync(`zip -j ${fn.zip} ${fn.out}`, { stdio: "inherit" });
    }

    console.log("\n🎉 Build & zip completed!");
}

main();
