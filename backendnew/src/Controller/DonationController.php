<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DonationController extends AbstractController
{
    #[Route('/api/donations', name: 'api_donations_list', methods: ['GET'])]
    public function list(Connection $db): JsonResponse
    {
        $sql = 'SELECT id, campagne_id, donateur_id, montant, message, date_don FROM donations ORDER BY date_don DESC';
        $rows = $db->fetchAllAssociative($sql);
        return $this->json($rows);
    }

    #[Route('/api/donations', name: 'api_donations_create', methods: ['POST'])]
    public function create(Request $request, Connection $db): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        if (!is_array($payload)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $campagneId = (int)($payload['campagne_id'] ?? 0);
        $nom        = trim((string)($payload['nom'] ?? ''));
        $email      = isset($payload['email']) && $payload['email'] !== '' ? (string)$payload['email'] : null;
        $montant    = (float)($payload['montant'] ?? 0);
        $message    = isset($payload['message']) ? (string)$payload['message'] : null;

        if ($campagneId <= 0 || $montant <= 0 || $nom === '') {
            return $this->json(['error' => 'campagne_id, nom et montant sont requis.'], Response::HTTP_BAD_REQUEST);
        }

        // Ensure campaign exists
        $campExists = $db->fetchOne('SELECT 1 FROM campaigns WHERE id = :id', ['id' => $campagneId]);
        if (!$campExists) {
            return $this->json(['error' => 'Campagne introuvable'], Response::HTTP_BAD_REQUEST);
        }

        // Find or create donor
        $donorId = null;
        if ($email) {
            $donorId = $db->fetchOne('SELECT id FROM donors WHERE email = :email', ['email' => $email]);
        }
        if (!$donorId) {
            $db->insert('donors', [
                'nom'   => $nom,
                'email' => $email,
            ]);
            $donorId = (int)$db->lastInsertId();
        }

        // Insert donation
        $db->insert('donations', [
            'campagne_id' => $campagneId,
            'donateur_id' => $donorId,
            'montant'     => $montant,
            'message'     => $message,
        ]);
        $donationId = (int)$db->lastInsertId();

        // Optionally update aggregate on campaigns
        $db->executeStatement('UPDATE campaigns SET montant_collecte = montant_collecte + :m WHERE id = :id', [
            'm'  => $montant,
            'id' => $campagneId,
        ]);

        $donation = $db->fetchAssociative('SELECT id, campagne_id, donateur_id, montant, message, date_don FROM donations WHERE id = :id', ['id' => $donationId]);
        $donor    = $db->fetchAssociative('SELECT id, nom, email FROM donors WHERE id = :id', ['id' => $donorId]);

        return $this->json([
            'donation' => $donation,
            'donor'    => $donor,
        ], Response::HTTP_CREATED);
    }
}
