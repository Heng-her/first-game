"""
Blender 5.x Python Automation Script
Generates 3D assets for the Cambodian 3D Tourism Adventure Game:
1. Cambodian Tuk-Tuk / Remork (public/models/vehicles/tuk-tuk.glb)
2. Angkor Sanctuary Complex (public/models/map/angkor-world.glb)
"""

import bpy
import os
import math

def clean_scene():
    """Wipe default objects, materials and collections."""
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_material(name, color_rgba, roughness=0.5, metallic=0.0, emissive=None):
    """Helper to create Principled BSDF material in Blender 5."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color_rgba
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
        if emissive and 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emissive[:3] + (1.0,)
            if 'Emission Strength' in bsdf.inputs:
                bsdf.inputs['Emission Strength'].default_value = emissive[3] if len(emissive) > 3 else 1.0
    return mat

# ==========================================================
# 1. GENERATE CAMBODIAN TUK-TUK / REMORK
# ==========================================================
def generate_tuktuk(output_path):
    clean_scene()
    print(f"--> Building Cambodian Tuk-Tuk at {output_path}...")

    # Materials
    mat_metal_red = create_material("TukTuk_BodyRed", (0.75, 0.08, 0.12, 1.0), roughness=0.3, metallic=0.2)
    mat_canopy = create_material("TukTuk_Canopy", (0.55, 0.05, 0.08, 1.0), roughness=0.8, metallic=0.0)
    mat_gold_trim = create_material("TukTuk_GoldTrim", (0.95, 0.72, 0.15, 1.0), roughness=0.3, metallic=0.7)
    mat_chrome = create_material("TukTuk_Chrome", (0.85, 0.87, 0.90, 1.0), roughness=0.15, metallic=0.95)
    mat_tire = create_material("TukTuk_Tire", (0.10, 0.10, 0.12, 1.0), roughness=0.85, metallic=0.0)
    mat_seat = create_material("TukTuk_LeatherSeat", (0.15, 0.12, 0.10, 1.0), roughness=0.6, metallic=0.1)
    mat_headlight = create_material("TukTuk_Headlight", (1.0, 0.9, 0.4, 1.0), roughness=0.1, metallic=0.0, emissive=(1.0, 0.85, 0.3, 3.0))

    # --- FRONT MOTORCYCLE UNIT ---
    # Front wheel
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.15, location=(0, 1.6, 0.35), rotation=(0, math.pi/2, 0))
    f_wheel = bpy.context.active_object
    f_wheel.name = "FrontWheel"
    f_wheel.data.materials.append(mat_tire)

    # Front wheel hub/spokes
    bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.16, location=(0, 1.6, 0.35), rotation=(0, math.pi/2, 0))
    f_hub = bpy.context.active_object
    f_hub.data.materials.append(mat_chrome)

    # Steering fork (left and right)
    for sx in [-0.12, 0.12]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.025, depth=0.85, location=(sx, 1.5, 0.65), rotation=(math.radians(18), 0, 0))
        fork = bpy.context.active_object
        fork.data.materials.append(mat_chrome)

    # Handlebars
    bpy.ops.mesh.primitive_cylinder_add(radius=0.022, depth=0.75, location=(0, 1.38, 1.05), rotation=(0, math.pi/2, 0))
    handlebars = bpy.context.active_object
    handlebars.data.materials.append(mat_chrome)

    # Headlight
    bpy.ops.mesh.primitive_cylinder_add(radius=0.12, depth=0.14, location=(0, 1.58, 0.95), rotation=(math.pi/2, 0, 0))
    headlight = bpy.context.active_object
    headlight.data.materials.append(mat_headlight)

    # Motorbike frame / Gas tank
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.95, 0.75))
    tank = bpy.context.active_object
    tank.scale = (0.28, 0.65, 0.35)
    tank.data.materials.append(mat_metal_red)

    # Driver seat
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0.55, 0.75))
    d_seat = bpy.context.active_object
    d_seat.scale = (0.32, 0.38, 0.15)
    d_seat.data.materials.append(mat_seat)

    # Rear bike wheel
    bpy.ops.mesh.primitive_cylinder_add(radius=0.32, depth=0.16, location=(0, 0.25, 0.32), rotation=(0, math.pi/2, 0))
    b_wheel = bpy.context.active_object
    b_wheel.data.materials.append(mat_tire)

    # --- HITCH COUPLING ---
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.75, location=(0, -0.15, 0.42), rotation=(math.radians(90), 0, 0))
    hitch = bpy.context.active_object
    hitch.data.materials.append(mat_chrome)

    # --- PASSENGER REMORK CARRIAGE ---
    # Carriage chassis floor
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.35, 0.48))
    chassis = bpy.context.active_object
    chassis.scale = (1.35, 1.65, 0.12)
    chassis.data.materials.append(mat_metal_red)

    # Two large carriage side wheels
    for sx, wname in [(-0.82, "LeftWheel"), (0.82, "RightWheel")]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.45, depth=0.16, location=(sx, -1.35, 0.45), rotation=(0, math.pi/2, 0))
        c_wheel = bpy.context.active_object
        c_wheel.name = wname
        c_wheel.data.materials.append(mat_tire)

        # Chrome rim
        bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.17, location=(sx, -1.35, 0.45), rotation=(0, math.pi/2, 0))
        c_rim = bpy.context.active_object
        c_rim.data.materials.append(mat_chrome)

        # Mudguards / Fenders
        bpy.ops.mesh.primitive_cylinder_add(radius=0.52, depth=0.20, location=(sx, -1.35, 0.52), rotation=(0, math.pi/2, 0))
        fender = bpy.context.active_object
        fender.scale = (1.0, 1.0, 0.5)
        fender.data.materials.append(mat_metal_red)

    # Passenger bench seats (Front facing backwards, Back facing forwards)
    # Seat 1: Front passenger bench
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.85, 0.75))
    seat1 = bpy.context.active_object
    seat1.scale = (1.1, 0.35, 0.18)
    seat1.data.materials.append(mat_seat)

    # Seat 1 Backrest
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.68, 1.05))
    backrest1 = bpy.context.active_object
    backrest1.scale = (1.1, 0.08, 0.45)
    backrest1.data.materials.append(mat_seat)

    # Seat 2: Rear passenger bench
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.85, 0.75))
    seat2 = bpy.context.active_object
    seat2.scale = (1.1, 0.35, 0.18)
    seat2.data.materials.append(mat_seat)

    # Seat 2 Backrest
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -2.02, 1.05))
    backrest2 = bpy.context.active_object
    backrest2.scale = (1.1, 0.08, 0.45)
    backrest2.data.materials.append(mat_seat)

    # 4 Canopy Corner Poles
    for px, py in [(-0.62, -0.62), (0.62, -0.62), (-0.62, -2.08), (0.62, -2.08)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.028, depth=1.35, location=(px, py, 1.25))
        pole = bpy.context.active_object
        pole.data.materials.append(mat_chrome)

    # Classic Cambodian Canopy Roof (Curved vaulted ceiling with gold rim)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.75, depth=1.65, location=(0, -1.35, 1.95), rotation=(math.pi/2, 0, 0))
    canopy = bpy.context.active_object
    canopy.scale = (0.95, 0.35, 1.0)
    canopy.data.materials.append(mat_canopy)

    # Canopy Top Ridge with Gold Trim
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -1.35, 2.15))
    gold_ridge = bpy.context.active_object
    gold_ridge.scale = (0.15, 1.7, 0.06)
    gold_ridge.data.materials.append(mat_gold_trim)

    # Safety handrails on sides
    for sx in [-0.62, 0.62]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=1.45, location=(sx, -1.35, 0.95), rotation=(math.pi/2, 0, 0))
        rail = bpy.context.active_object
        rail.data.materials.append(mat_chrome)

    # Tail lights
    for sx in [-0.55, 0.55]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, -2.18, 0.52))
        tlight = bpy.context.active_object
        tlight.scale = (0.12, 0.05, 0.08)
        tlight.data.materials.append(create_material("TukTuk_TailLight", (0.9, 0.05, 0.05, 1.0), roughness=0.2, emissive=(1.0, 0.0, 0.0, 2.5)))

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Select all and export
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB')
    print(f"✓ Tuk-Tuk exported successfully to {output_path}")

# ==========================================================
# 2. GENERATE ANGKOR SANCTUARY COMPLEX (angkor-world.glb)
# ==========================================================
def generate_angkor(output_path):
    clean_scene()
    print(f"--> Building Angkor Sanctuary Complex at {output_path}...")

    # Materials
    mat_sandstone = create_material("Angkor_Sandstone", (0.52, 0.44, 0.34, 1.0), roughness=0.92, metallic=0.0)
    mat_dark_stone = create_material("Angkor_DarkStone", (0.36, 0.30, 0.23, 1.0), roughness=0.95, metallic=0.0)
    mat_mossy_stone = create_material("Angkor_MossyStone", (0.32, 0.38, 0.25, 1.0), roughness=0.88, metallic=0.0)
    mat_pinnacle_gold = create_material("Angkor_PinnacleGold", (0.95, 0.65, 0.12, 1.0), roughness=0.35, metallic=0.75)
    mat_lantern_glow = create_material("Angkor_LanternGlow", (1.0, 0.75, 0.25, 1.0), roughness=0.2, emissive=(1.0, 0.65, 0.1, 4.0))

    # --- BASE PLATFORMS (ខឿនប្រាសាទថ្នាក់ៗ) ---
    # Tier 1 - Grand Lower Terrace (36m x 36m x 1.2m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.6))
    t1 = bpy.context.active_object
    t1.scale = (36.0, 36.0, 1.2)
    t1.data.materials.append(mat_sandstone)

    # Tier 2 - Intermediate Terrace (26m x 26m x 1.4m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.9))
    t2 = bpy.context.active_object
    t2.scale = (26.0, 26.0, 1.4)
    t2.data.materials.append(mat_dark_stone)

    # Tier 3 - Sanctum Upper Terrace (16m x 16m x 1.5m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 3.35))
    t3 = bpy.context.active_object
    t3.scale = (16.0, 16.0, 1.5)
    t3.data.materials.append(mat_sandstone)

    # --- HELPER: LOTUS-BUD PRANG TOWER (ប្រាង្គផ្កាឈូកអង្គរ) ---
    def build_prang(cx, cy, base_z, height_scale, radius_scale, name_prefix):
        # Multi-tiered tapered tower body (7 tiers of stepped moldings)
        num_tiers = 8
        current_z = base_z
        tier_height = (height_scale * 0.7) / num_tiers

        for i in range(num_tiers):
            t_frac = i / float(num_tiers)
            r = radius_scale * (1.0 - t_frac * 0.42)
            bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=tier_height, location=(cx, cy, current_z + tier_height/2), vertices=12)
            tier_cyl = bpy.context.active_object
            tier_cyl.data.materials.append(mat_mossy_stone if i % 2 == 0 else mat_dark_stone)
            
            # Decorative carved cornice border around each tier
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(cx, cy, current_z + tier_height * 0.95))
            cornice = bpy.context.active_object
            cornice.scale = (r * 2.15, r * 2.15, tier_height * 0.18)
            cornice.data.materials.append(mat_sandstone)

            current_z += tier_height

        # Lotus-bud tapered crown (ផ្កាឈូកក្រពុំ)
        crown_height = height_scale * 0.25
        bpy.ops.mesh.primitive_cone_add(radius1=radius_scale * 0.55, radius2=0.08, depth=crown_height, location=(cx, cy, current_z + crown_height/2), vertices=12)
        crown = bpy.context.active_object
        crown.data.materials.append(mat_sandstone)
        current_z += crown_height

        # Golden Finial Pinnacle (កំពូលកុណ្ឌីមាស)
        finial_height = height_scale * 0.12
        bpy.ops.mesh.primitive_cone_add(radius1=0.22, radius2=0.02, depth=finial_height, location=(cx, cy, current_z + finial_height/2), vertices=8)
        finial = bpy.context.active_object
        finial.data.materials.append(mat_pinnacle_gold)

    # Build Central Grand Sanctuary Prang (កំពូលប្រាសាទកណ្តាល)
    build_prang(0, 0, 4.1, height_scale=14.0, radius_scale=3.8, name_prefix="CentralPrang")

    # Build 4 Corner Prangs (កំពូលប្រាសាទជ្រុងទាំង ៤)
    corner_offset = 6.2
    for px, py, cname in [
        (-corner_offset, -corner_offset, "CornerSW"),
        (corner_offset, -corner_offset, "CornerSE"),
        (-corner_offset, corner_offset, "CornerNW"),
        (corner_offset, corner_offset, "CornerNE")
    ]:
        build_prang(px, py, 4.1, height_scale=9.0, radius_scale=2.2, name_prefix=cname)

    # --- CLOISTER GALLERIES & COLONNADE PILLARS (ថែវ និងសសរឆ្លាក់) ---
    for dist in [-8.5, 8.5]:
        for step in range(-3, 4):
            # Left & Right Gallery Colonnades
            bpy.ops.mesh.primitive_cylinder_add(radius=0.24, depth=2.8, location=(dist, step * 2.2, 4.1 + 1.4), vertices=8)
            pillar = bpy.context.active_object
            pillar.data.materials.append(mat_sandstone)

            # Pillar Capital
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(dist, step * 2.2, 4.1 + 2.85))
            cap = bpy.context.active_object
            cap.scale = (0.65, 0.65, 0.2)
            cap.data.materials.append(mat_dark_stone)

    # Gallery Roof Arch
    for dist in [-8.5, 8.5]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(dist, 0, 4.1 + 3.15))
        roof = bpy.context.active_object
        roof.scale = (1.2, 16.5, 0.35)
        roof.data.materials.append(mat_dark_stone)

    # --- GRAND STAIRWAYS (កាំជណ្តើរថ្មទាំង ៤ ទិស) ---
    for rot, (sx, sy) in [
        (0, (0, 18.0)),             # South / Front Entrance
        (math.pi, (0, -18.0)),       # North
        (math.pi/2, (18.0, 0)),      # East
        (-math.pi/2, (-18.0, 0))     # West
    ]:
        # Stepped stair block
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(sx, sy, 0.6), rotation=(0, 0, rot))
        stairs = bpy.context.active_object
        stairs.scale = (4.5, 3.2, 1.2)
        stairs.data.materials.append(mat_sandstone)

        # Naga Balustrade flanking stairs
        for side in [-2.5, 2.5]:
            off_x = sx + (side if rot == 0 or rot == math.pi else 0)
            off_y = sy + (side if rot != 0 and rot != math.pi else 0)
            
            bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=3.5, location=(off_x, off_y, 0.8), rotation=(math.radians(35), 0, rot))
            naga_body = bpy.context.active_object
            naga_body.data.materials.append(mat_dark_stone)

            # Raised 5-headed Naga Finial at the foot
            bpy.ops.mesh.primitive_cone_add(radius1=0.45, radius2=0.1, depth=1.1, location=(off_x, off_y + (1.2 if sy > 0 else -1.2 if sy < 0 else 0), 1.0))
            naga_head = bpy.context.active_object
            naga_head.data.materials.append(mat_pinnacle_gold)

    # --- ANCIENT STONE LANTERNS WITH WARM AMBER GLOW ---
    for lx, ly in [(-4.5, 14.5), (4.5, 14.5), (-14.5, 4.5), (14.5, 4.5)]:
        # Base
        bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.9, location=(lx, ly, 1.65), vertices=8)
        l_base = bpy.context.active_object
        l_base.data.materials.append(mat_sandstone)

        # Light chamber (Glow)
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, ly, 2.35))
        l_glow = bpy.context.active_object
        l_glow.scale = (0.45, 0.45, 0.45)
        l_glow.data.materials.append(mat_lantern_glow)

        # Lantern Roof Cap
        bpy.ops.mesh.primitive_cone_add(radius1=0.55, radius2=0.05, depth=0.4, location=(lx, ly, 2.75), vertices=8)
        l_cap = bpy.context.active_object
        l_cap.data.materials.append(mat_dark_stone)

    # Ensure parent directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Select all and export
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(filepath=output_path, export_format='GLB')
    print(f"✓ Angkor Sanctuary exported successfully to {output_path}")

# ==========================================================
# MAIN EXECUTION
# ==========================================================
if __name__ == "__main__":
    workspace_root = os.path.abspath(".")
    tuktuk_file = os.path.join(workspace_root, "public", "models", "vehicles", "tuk-tuk.glb")
    angkor_file = os.path.join(workspace_root, "public", "models", "map", "angkor-world.glb")

    print("\n=======================================================")
    print("STARTING BLENDER 3D MODEL GENERATION...")
    print("=======================================================\n")

    generate_tuktuk(tuktuk_file)
    generate_angkor(angkor_file)

    print("\n=======================================================")
    print("ALL MODELS GENERATED AND EXPORTED SUCCESSFULLY!")
    print("=======================================================\n")
