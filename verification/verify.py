
import asyncio
from playwright.async_api import async_playwright
import sys
import os

async def main():
    if len(sys.argv) != 2:
        print("Usage: python verify.py <html_file>")
        return

    html_file = sys.argv[1]
    filepath = f"file://{os.path.abspath(html_file)}"
    screenshot_dir = "verification/screenshots"
    screenshot_path = os.path.join(screenshot_dir, f"screenshot-{os.path.basename(html_file)}.png")

    # Create screenshot directory if it doesn't exist
    os.makedirs(screenshot_dir, exist_ok=True)

    print(f"Processing file: {html_file}")
    print(f"Absolute path: {filepath}")
    print(f"Screenshot will be saved to: {screenshot_path}")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        print("Navigating to page...")
        await page.goto(filepath)
        print("Page loaded.")

        print("Waiting for preloader to hide...")
        await page.wait_for_selector('#preloader', state='hidden', timeout=5000)
        print("Preloader is hidden.")

        print("Scrolling to the bottom of the page...")
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        print("Page scrolled.")

        print("Waiting for animations to complete...")
        await page.wait_for_timeout(1000)
        print("Wait complete.")

        print("Taking screenshot...")
        await page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved successfully at {screenshot_path}")

        await browser.close()
        print("Browser closed.")

if __name__ == "__main__":
    asyncio.run(main())
